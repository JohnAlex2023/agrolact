<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\StoreVentaTiendaRequest;
use App\Services\TiendaService;
use Illuminate\Http\JsonResponse;

class TiendaController extends Controller
{
    public function __construct(protected TiendaService $tiendaService) {}

    public function productos(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->tiendaService->listarProductosActivos()]);
    }

    public function storeProducto(StoreProductoRequest $request): JsonResponse
    {
        $producto = $this->tiendaService->registrarProducto($request->validated());

        return response()->json(['status' => 'ok', 'data' => $producto], 201);
    }

    public function storeVenta(StoreVentaTiendaRequest $request): JsonResponse
    {
        $venta = $this->tiendaService->registrarVenta($request->validated(), $request->user()->id);

        return response()->json(['status' => 'ok', 'data' => $venta], 201);
    }

    public function fiadosPendientesPorSocio(string $socio): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->tiendaService->fiadosPendientesPorSocio($socio)]);
    }
}
