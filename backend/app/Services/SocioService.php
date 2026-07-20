<?php

namespace App\Services;

use App\Models\Socio;
use App\Repositories\SocioRepository;
use Illuminate\Database\Eloquent\Collection;

class SocioService
{
    public function __construct(protected SocioRepository $socios) {}

    public function listarActivos(): Collection
    {
        return $this->socios->activos();
    }

    public function obtenerHistorial(string $id): Socio
    {
        return $this->socios->conHistorial($id);
    }

    public function registrar(array $datos): Socio
    {
        return $this->socios->create($datos);
    }

    public function editar(string $id, array $datos): Socio
    {
        $socio = $this->socios->findOrFail($id);

        return $this->socios->update($socio, $datos);
    }
}
