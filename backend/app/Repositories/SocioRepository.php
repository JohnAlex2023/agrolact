<?php

namespace App\Repositories;

use App\Models\Socio;
use Illuminate\Database\Eloquent\Collection;

class SocioRepository
{
    public function activos(): Collection
    {
        return Socio::where('activo', true)->orderBy('nombres')->get();
    }

    public function findOrFail(string $id): Socio
    {
        return Socio::findOrFail($id);
    }

    public function conHistorial(string $id): Socio
    {
        return Socio::with(['registrosLeche', 'liquidaciones' => fn ($q) => $q->latest('created_at')])
            ->findOrFail($id);
    }

    public function create(array $datos): Socio
    {
        return Socio::create($datos);
    }

    public function update(Socio $socio, array $datos): Socio
    {
        $socio->update($datos);

        return $socio;
    }
}
