<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function (): JsonResponse {
    return response()->json([
        'status' => 'ok',
        'app' => 'AgroLact API',
        'message' => 'Backend is running. Use /api/* endpoints.',
    ]);
});
