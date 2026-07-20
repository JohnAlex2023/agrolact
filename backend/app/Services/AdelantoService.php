<?php

namespace App\Services;

use App\Models\Adelanto;
use App\Repositories\AdelantoRepository;
use Illuminate\Database\Eloquent\Collection;

class AdelantoService
{
    public function __construct(protected AdelantoRepository $adelantos) {}

    public function registrar(array $datos, string $registradoPor): Adelanto
    {
        return $this->adelantos->create([...$datos, 'registrado_por' => $registradoPor]);
    }

    public function pendientesPorSocio(string $socioId): Collection
    {
        return $this->adelantos->pendientesPorSocio($socioId);
    }
}
