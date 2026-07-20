<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSocioRequest;
use App\Http\Requests\UpdateSocioRequest;
use App\Services\SocioService;
use Illuminate\Http\JsonResponse;

class SocioController extends Controller
{
    public function __construct(protected SocioService $socioService) {}

    public function index(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->socioService->listarActivos()]);
    }

    public function show(string $socio): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->socioService->obtenerHistorial($socio)]);
    }

    public function store(StoreSocioRequest $request): JsonResponse
    {
        $socio = $this->socioService->registrar($request->validated());

        return response()->json(['status' => 'ok', 'data' => $socio], 201);
    }

    public function update(UpdateSocioRequest $request, string $socio): JsonResponse
    {
        $actualizado = $this->socioService->editar($socio, $request->validated());

        return response()->json(['status' => 'ok', 'data' => $actualizado]);
    }
}
