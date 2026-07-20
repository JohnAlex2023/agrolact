<?php

namespace App\Repositories;

use App\Models\Liquidacion;
use Illuminate\Database\Eloquent\Collection;

class LiquidacionRepository
{
    public function create(array $datos): Liquidacion
    {
        return Liquidacion::create($datos);
    }

    public function ultimaDelSocio(string $socioId, string $excluirQuincenaId): ?Liquidacion
    {
        return Liquidacion::where('socio_id', $socioId)
            ->where('quincena_id', '!=', $excluirQuincenaId)
            ->join('quincenas', 'quincenas.id', '=', 'liquidaciones.quincena_id')
            ->orderByDesc('quincenas.fecha_inicio')
            ->select('liquidaciones.*')
            ->first();
    }

    public function porQuincena(string $quincenaId): Collection
    {
        return Liquidacion::with('socio')->where('quincena_id', $quincenaId)->get();
    }
}
