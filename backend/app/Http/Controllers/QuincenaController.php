<?php

namespace App\Http\Controllers;

use App\Http\Requests\AbrirQuincenaRequest;
use App\Http\Requests\DefinirPrecioRequest;
use App\Services\LiquidacionService;
use App\Services\QuincenaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuincenaController extends Controller
{
    public function __construct(
        protected QuincenaService $quincenaService,
        protected LiquidacionService $liquidacionService,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->quincenaService->listar()]);
    }

    public function actual(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->quincenaService->actual()]);
    }

    public function store(AbrirQuincenaRequest $request): JsonResponse
    {
        $quincena = $this->quincenaService->abrir(
            $request->validated('fecha_inicio'),
            $request->validated('fecha_fin'),
            $request->user()->id,
        );

        return response()->json(['status' => 'ok', 'data' => $quincena], 201);
    }

    public function definirPrecio(DefinirPrecioRequest $request, string $quincena): JsonResponse
    {
        $actualizada = $this->quincenaService->definirPrecio($quincena, (float) $request->validated('precio_litro'));

        return response()->json(['status' => 'ok', 'data' => $actualizada]);
    }

    public function cerrar(Request $request, string $quincena): JsonResponse
    {
        $liquidaciones = $this->liquidacionService->cerrarQuincena($quincena, $request->user()->id);

        return response()->json(['status' => 'ok', 'data' => $liquidaciones]);
    }

    public function liquidaciones(string $quincena): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->liquidacionService->porQuincena($quincena)]);
    }
}
