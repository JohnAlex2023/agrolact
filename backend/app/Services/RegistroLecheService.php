<?php

namespace App\Services;

use App\Enums\AccionAuditoria;
use App\Exceptions\AppException;
use App\Models\CorreccionLeche;
use App\Models\RegistroLeche;
use App\Repositories\QuincenaRepository;
use App\Repositories\RegistroLecheRepository;
use Illuminate\Database\Eloquent\Collection;

class RegistroLecheService
{
    public function __construct(
        protected RegistroLecheRepository $registros,
        protected QuincenaRepository $quincenas,
        protected AuditoriaService $auditoria,
    ) {}

    public function registrar(array $datos, string $registradoPor): RegistroLeche
    {
        $quincena = $this->quincenas->abierta();

        if (! $quincena) {
            throw new AppException('No hay una quincena abierta', 409);
        }

        if ($this->registros->existeParaSocioFechaJornada($datos['socio_id'], $datos['fecha'], $datos['jornada'])) {
            throw new AppException('Ya existe un registro para este socio en esa fecha y jornada', 422);
        }

        $registro = $this->registros->create([
            ...$datos,
            'quincena_id' => $quincena->id,
            'registrado_por' => $registradoPor,
        ]);

        $this->auditoria->registrar($registradoPor, 'registros_leche', AccionAuditoria::INSERT, $registro->id, null, $registro->toArray());

        return $registro;
    }

    public function delDia(string $fecha): Collection
    {
        return $this->registros->delDia($fecha);
    }

    public function historialPorSocio(string $socioId): Collection
    {
        return $this->registros->historialPorSocio($socioId);
    }

    public function corregir(string $registroId, float $litrosNuevos, string $observacion, string $corregidoPor): RegistroLeche
    {
        $registro = $this->registros->findOrFail($registroId);
        $valorAnterior = $registro->litros;

        CorreccionLeche::create([
            'registro_id' => $registro->id,
            'valor_anterior' => $valorAnterior,
            'valor_nuevo' => $litrosNuevos,
            'observacion' => $observacion,
            'corregido_por' => $corregidoPor,
        ]);

        $registro->update(['litros' => $litrosNuevos]);

        $this->auditoria->registrar(
            $corregidoPor,
            'registros_leche',
            AccionAuditoria::UPDATE,
            $registro->id,
            ['litros' => (string) $valorAnterior],
            ['litros' => (string) $litrosNuevos],
        );

        return $registro;
    }
}
