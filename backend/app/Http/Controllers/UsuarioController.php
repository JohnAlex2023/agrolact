<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    public function __construct(protected UsuarioService $usuarioService) {}

    public function index(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->usuarioService->listar()]);
    }

    public function store(StoreUsuarioRequest $request): JsonResponse
    {
        $usuario = $this->usuarioService->crear($request->validated());

        return response()->json(['status' => 'ok', 'data' => $usuario], 201);
    }

    public function update(UpdateUsuarioRequest $request, string $usuario): JsonResponse
    {
        $actualizado = $this->usuarioService->editar($usuario, $request->validated());

        return response()->json(['status' => 'ok', 'data' => $actualizado]);
    }
}
