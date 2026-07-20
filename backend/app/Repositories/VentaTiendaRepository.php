<?php

namespace App\Repositories;

use App\Enums\TipoVenta;
use App\Models\VentaTienda;
use Illuminate\Database\Eloquent\Collection;

class VentaTiendaRepository
{
    public function create(array $datos): VentaTienda
    {
        return VentaTienda::create($datos);
    }

    public function fiadosPendientesPorSocio(string $socioId): Collection
    {
        return VentaTienda::with('producto')
            ->where('socio_id', $socioId)
            ->where('tipo', TipoVenta::FIADO)
            ->where('descontado', false)
            ->get();
    }
}
