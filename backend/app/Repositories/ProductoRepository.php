<?php

namespace App\Repositories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Collection;

class ProductoRepository
{
    public function activos(): Collection
    {
        return Producto::where('activo', true)->orderBy('nombre')->get();
    }

    public function create(array $datos): Producto
    {
        return Producto::create($datos);
    }
}
