<?php

namespace App\Repositories;

use App\Models\RegistroLeche;
use Illuminate\Database\Eloquent\Collection;

class RegistroLecheRepository
{
    public function existeParaSocioFechaJornada(string $socioId, string $fecha, string $jornada): bool
    {
        return RegistroLeche::where('socio_id', $socioId)
            ->where('fecha', $fecha)
            ->where('jornada', $jornada)
            ->exists();
    }

    public function delDia(string $fecha): Collection
    {
        return RegistroLeche::with('socio')->where('fecha', $fecha)->get();
    }

    public function porQuincena(string $quincenaId): Collection
    {
        return RegistroLeche::where('quincena_id', $quincenaId)->get();
    }

    public function historialPorSocio(string $socioId): Collection
    {
        return RegistroLeche::where('socio_id', $socioId)->orderByDesc('fecha')->get();
    }

    public function totalLitros(string $socioId, string $quincenaId): float
    {
        return (float) RegistroLeche::where('socio_id', $socioId)
            ->where('quincena_id', $quincenaId)
            ->sum('litros');
    }

    public function findOrFail(string $id): RegistroLeche
    {
        return RegistroLeche::findOrFail($id);
    }

    public function create(array $datos): RegistroLeche
    {
        return RegistroLeche::create($datos);
    }
}
