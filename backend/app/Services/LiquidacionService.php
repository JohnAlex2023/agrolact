<?php

namespace App\Services;

use App\Enums\AccionAuditoria;
use App\Enums\EstadoQuincena;
use App\Exceptions\AppException;
use App\Models\AbonoAdelanto;
use App\Models\Liquidacion;
use App\Repositories\AdelantoRepository;
use App\Repositories\LiquidacionRepository;
use App\Repositories\QuincenaRepository;
use App\Repositories\RegistroLecheRepository;
use App\Repositories\SocioRepository;
use App\Repositories\VentaTiendaRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LiquidacionService
{
    public function __construct(
        protected QuincenaRepository $quincenas,
        protected SocioRepository $socios,
        protected RegistroLecheRepository $registrosLeche,
        protected AdelantoRepository $adelantos,
        protected VentaTiendaRepository $ventasTienda,
        protected LiquidacionRepository $liquidaciones,
        protected AuditoriaService $auditoria,
    ) {}

    public function porQuincena(string $quincenaId): Collection
    {
        return $this->liquidaciones->porQuincena($quincenaId);
    }

    public function cerrarQuincena(string $quincenaId, string $cerradoPor): Collection
    {
        $quincena = $this->quincenas->findOrFail($quincenaId);

        if ($quincena->estado !== EstadoQuincena::ABIERTA) {
            throw new AppException('La quincena ya esta cerrada', 409);
        }

        if ($quincena->precio_litro === null) {
            throw new AppException('Debe definir el precio por litro antes de cerrar la quincena', 409);
        }

        $liquidacionesGeneradas = DB::transaction(function () use ($quincena, $cerradoPor) {
            $generadas = collect();

            foreach ($this->socios->activos() as $socio) {
                $totalLitros = $this->registrosLeche->totalLitros($socio->id, $quincena->id);
                $valorBruto = round($totalLitros * (float) $quincena->precio_litro, 2);

                $adelantosPendientes = $this->adelantos->pendientesPorSocio($socio->id);
                $descuentoAdelantos = 0.0;

                $fiadosPendientes = $this->ventasTienda->fiadosPendientesPorSocio($socio->id);
                $descuentoFiados = round((float) $fiadosPendientes->sum('total'), 2);

                $liquidacionAnterior = $this->liquidaciones->ultimaDelSocio($socio->id, $quincena->id);
                $saldoDeudaAnterior = $liquidacionAnterior && $liquidacionAnterior->saldo_nuevo < 0
                    ? abs((float) $liquidacionAnterior->saldo_nuevo)
                    : 0.0;

                $neto = $valorBruto - $saldoDeudaAnterior - $descuentoFiados;

                foreach ($adelantosPendientes as $adelanto) {
                    $abono = min((float) ($adelanto->abono_acordado ?? $adelanto->saldo_restante), $adelanto->saldo_restante, max($neto, 0));

                    if ($abono <= 0) {
                        continue;
                    }

                    $adelanto->_abono_aplicado = $abono;
                    $descuentoAdelantos += $abono;
                    $neto -= $abono;
                }

                $netoPagar = $neto >= 0 ? round($neto, 2) : 0.0;
                $saldoNuevo = $neto >= 0 ? 0.0 : round($neto, 2);

                $liquidacion = $this->liquidaciones->create([
                    'quincena_id' => $quincena->id,
                    'socio_id' => $socio->id,
                    'total_litros' => $totalLitros,
                    'valor_bruto' => $valorBruto,
                    'descuento_adelantos' => round($descuentoAdelantos, 2),
                    'descuento_fiados' => $descuentoFiados,
                    'saldo_deuda_anterior' => $saldoDeudaAnterior,
                    'neto_pagar' => $netoPagar,
                    'saldo_nuevo' => $saldoNuevo,
                ]);

                foreach ($adelantosPendientes as $adelanto) {
                    if (($adelanto->_abono_aplicado ?? 0) > 0) {
                        AbonoAdelanto::create([
                            'adelanto_id' => $adelanto->id,
                            'liquidacion_id' => $liquidacion->id,
                            'monto' => $adelanto->_abono_aplicado,
                        ]);
                    }
                }

                $fiadosPendientes->each->update(['descontado' => true]);

                $this->auditoria->registrar(
                    $cerradoPor,
                    'liquidaciones',
                    AccionAuditoria::INSERT,
                    $liquidacion->id,
                    null,
                    $liquidacion->toArray(),
                );

                $generadas->push($liquidacion);
            }

            $this->quincenas->update($quincena, ['estado' => EstadoQuincena::CERRADA]);

            return $generadas;
        });

        return $liquidacionesGeneradas;
    }
}
