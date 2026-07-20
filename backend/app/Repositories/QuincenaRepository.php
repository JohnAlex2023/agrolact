<?php

namespace App\Repositories;

use App\Enums\EstadoQuincena;
use App\Models\Quincena;
use Illuminate\Database\Eloquent\Collection;

class QuincenaRepository
{
    public function abierta(): ?Quincena
    {
        return Quincena::where('estado', EstadoQuincena::ABIERTA)->first();
    }

    public function findOrFail(string $id): Quincena
    {
        return Quincena::findOrFail($id);
    }

    public function todas(): Collection
    {
        return Quincena::orderByDesc('fecha_inicio')->get();
    }

    public function create(array $datos): Quincena
    {
        return Quincena::create($datos);
    }

    public function update(Quincena $quincena, array $datos): Quincena
    {
        $quincena->update($datos);

        return $quincena;
    }
}
