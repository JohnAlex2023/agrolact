<?php

namespace App\Services;

use App\Enums\EstadoQuincena;
use App\Exceptions\AppException;
use App\Models\Quincena;
use App\Repositories\QuincenaRepository;
use Illuminate\Database\Eloquent\Collection;

class QuincenaService
{
    public function __construct(protected QuincenaRepository $quincenas) {}

    public function listar(): Collection
    {
        return $this->quincenas->todas();
    }

    public function actual(): ?Quincena
    {
        return $this->quincenas->abierta();
    }

    public function abrir(string $fechaInicio, string $fechaFin, string $creadoPor): Quincena
    {
        if ($this->quincenas->abierta()) {
            throw new AppException('Ya existe una quincena abierta', 409);
        }

        return $this->quincenas->create([
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'creado_por' => $creadoPor,
            'estado' => EstadoQuincena::ABIERTA,
        ]);
    }

    public function definirPrecio(string $id, float $precioLitro): Quincena
    {
        $quincena = $this->quincenas->findOrFail($id);

        if ($quincena->estado !== EstadoQuincena::ABIERTA) {
            throw new AppException('Solo se puede definir el precio en una quincena abierta', 409);
        }

        return $this->quincenas->update($quincena, ['precio_litro' => $precioLitro]);
    }
}
