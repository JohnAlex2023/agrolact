<?php

namespace App\Http\Controllers;

use App\Services\ReporteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function __construct(protected ReporteService $reporteService) {}

    public function produccionPorSocio(Request $request, string $socio): JsonResponse
    {
        $datos = $request->validate([
            'desde' => ['required', 'date'],
            'hasta' => ['required', 'date', 'after_or_equal:desde'],
        ]);

        return response()->json([
            'status' => 'ok',
            'data' => $this->reporteService->produccionPorSocio($socio, $datos['desde'], $datos['hasta']),
        ]);
    }

    public function produccionTotal(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'desde' => ['required', 'date'],
            'hasta' => ['required', 'date', 'after_or_equal:desde'],
        ]);

        return response()->json([
            'status' => 'ok',
            'data' => $this->reporteService->produccionTotal($datos['desde'], $datos['hasta']),
        ]);
    }

    public function estadoCuentaPorSocio(string $socio): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->reporteService->estadoCuentaPorSocio($socio)]);
    }

    public function adelantosPendientes(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->reporteService->adelantosPendientes()]);
    }

    public function fiadosPendientes(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'data' => $this->reporteService->fiadosPendientes()]);
    }
}
