<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Models\GastoOperativo;
use App\Repositories\GastoOperativoRepository;
use App\Repositories\QuincenaRepository;
use Illuminate\Database\Eloquent\Collection;

class GastoOperativoService
{
    public function __construct(
        protected GastoOperativoRepository $gastos,
        protected QuincenaRepository $quincenas,
    ) {}

    public function registrar(array $datos, string $registradoPor): GastoOperativo
    {
        $quincena = $this->quincenas->abierta();

        if (! $quincena) {
            throw new AppException('No hay una quincena abierta', 409);
        }

        return $this->gastos->create([
            ...$datos,
            'quincena_id' => $quincena->id,
            'registrado_por' => $registradoPor,
        ]);
    }

    public function delaActual(): Collection
    {
        $quincena = $this->quincenas->abierta();

        if (! $quincena) {
            return new Collection();
        }

        return $this->gastos->porQuincena($quincena->id);
    }
}
