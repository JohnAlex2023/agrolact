<?php

namespace App\Services;

use App\Enums\TipoVenta;
use App\Models\Adelanto;
use App\Models\Liquidacion;
use App\Models\RegistroLeche;
use App\Models\VentaTienda;
use Illuminate\Support\Collection;

class ReporteService
{
    public function produccionPorSocio(string $socioId, string $desde, string $hasta): array
    {
        $totalLitros = RegistroLeche::where('socio_id', $socioId)
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('litros');

        return ['socio_id' => $socioId, 'desde' => $desde, 'hasta' => $hasta, 'total_litros' => (float) $totalLitros];
    }

    public function produccionTotal(string $desde, string $hasta): Collection
    {
        return RegistroLeche::selectRaw('socio_id, SUM(litros) as total_litros')
            ->with('socio:id,nombres')
            ->whereBetween('fecha', [$desde, $hasta])
            ->groupBy('socio_id')
            ->get();
    }

    public function estadoCuentaPorSocio(string $socioId): Collection
    {
        return Liquidacion::with('quincena:id,fecha_inicio,fecha_fin')
            ->where('socio_id', $socioId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function adelantosPendientes(): Collection
    {
        return Adelanto::with('socio:id,nombres')
            ->withSum('abonos', 'monto')
            ->get()
            ->map(function (Adelanto $adelanto) {
                $adelanto->saldo_restante = round($adelanto->valor - ($adelanto->abonos_sum_monto ?? 0), 2);

                return $adelanto;
            })
            ->filter(fn (Adelanto $adelanto) => $adelanto->saldo_restante > 0)
            ->values();
    }

    public function fiadosPendientes(): Collection
    {
        return VentaTienda::with(['socio:id,nombres', 'producto:id,nombre'])
            ->where('tipo', TipoVenta::FIADO)
            ->where('descontado', false)
            ->get();
    }
}
