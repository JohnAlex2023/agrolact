<?php

namespace App\Http\Controllers;

use App\Http\Requests\CorregirLecheRequest;
use App\Http\Requests\StoreRegistroLecheRequest;
use App\Services\RegistroLecheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistroLecheController extends Controller
{
    public function __construct(protected RegistroLecheService $registroLecheService) {}

    public function store(StoreRegistroLecheRequest $request): JsonResponse
    {
        $registro = $this->registroLecheService->registrar($request->validated(), $request->user()->id);

        return response()->json(['status' => 'ok', 'data' => $registro], 201);
    }

    public function delDia(Request $request): JsonResponse
    {
        $fecha = $request->query('fecha', now()->toDateString());

        return response()->json(['status' => 'ok', 'data' => $this->registroLecheService->delDia($fecha)]);
    }

    public function historialPorSocio(string $socio): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->registroLecheService->historialPorSocio($socio)]);
    }

    public function porQuincena(string $quincena): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->registroLecheService->porQuincena($quincena)]);
    }

    public function corregir(CorregirLecheRequest $request, string $registro): JsonResponse
    {
        $actualizado = $this->registroLecheService->corregir(
            $registro,
            (float) $request->validated('litros'),
            $request->validated('observacion'),
            $request->user()->id,
        );

        return response()->json(['status' => 'ok', 'data' => $actualizado]);
    }
}
