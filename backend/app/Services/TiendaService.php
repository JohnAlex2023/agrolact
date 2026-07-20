<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Models\Producto;
use App\Models\VentaTienda;
use App\Repositories\ProductoRepository;
use App\Repositories\QuincenaRepository;
use App\Repositories\VentaTiendaRepository;
use Illuminate\Database\Eloquent\Collection;

class TiendaService
{
    public function __construct(
        protected ProductoRepository $productos,
        protected VentaTiendaRepository $ventas,
        protected QuincenaRepository $quincenas,
    ) {}

    public function listarProductosActivos(): Collection
    {
        return $this->productos->activos();
    }

    public function registrarProducto(array $datos): Producto
    {
        return $this->productos->create($datos);
    }

    public function registrarVenta(array $datos, string $registradoPor): VentaTienda
    {
        $quincena = $this->quincenas->abierta();

        if (! $quincena) {
            throw new AppException('No hay una quincena abierta', 409);
        }

        $total = round($datos['cantidad'] * $datos['precio_unitario'], 2);

        return $this->ventas->create([
            ...$datos,
            'total' => $total,
            'quincena_id' => $quincena->id,
            'descontado' => false,
            'registrado_por' => $registradoPor,
        ]);
    }

    public function fiadosPendientesPorSocio(string $socioId): Collection
    {
        return $this->ventas->fiadosPendientesPorSocio($socioId);
    }
}
