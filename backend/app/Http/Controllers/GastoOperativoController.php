<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGastoOperativoRequest;
use App\Services\GastoOperativoService;
use Illuminate\Http\JsonResponse;

class GastoOperativoController extends Controller
{
    public function __construct(protected GastoOperativoService $gastoOperativoService) {}

    public function store(StoreGastoOperativoRequest $request): JsonResponse
    {
        $gasto = $this->gastoOperativoService->registrar($request->validated(), $request->user()->id);

        return response()->json(['status' => 'ok', 'data' => $gasto], 201);
    }
}
