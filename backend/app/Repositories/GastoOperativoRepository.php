<?php

namespace App\Repositories;

use App\Models\GastoOperativo;
use Illuminate\Database\Eloquent\Collection;

class GastoOperativoRepository
{
    public function create(array $datos): GastoOperativo
    {
        return GastoOperativo::create($datos);
    }

    public function porQuincena(string $quincenaId): Collection
    {
        return GastoOperativo::where('quincena_id', $quincenaId)->get();
    }
}
