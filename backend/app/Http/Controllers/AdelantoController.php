<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdelantoRequest;
use App\Services\AdelantoService;
use Illuminate\Http\JsonResponse;

class AdelantoController extends Controller
{
    public function __construct(protected AdelantoService $adelantoService) {}

    public function store(StoreAdelantoRequest $request): JsonResponse
    {
        $adelanto = $this->adelantoService->registrar($request->validated(), $request->user()->id);

        return response()->json(['status' => 'ok', 'data' => $adelanto], 201);
    }

    public function pendientesPorSocio(string $socio): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->adelantoService->pendientesPorSocio($socio)]);
    }
}
