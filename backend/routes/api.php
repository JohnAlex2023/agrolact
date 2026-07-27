<?php

use App\Http\Controllers\AdelantoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\GastoOperativoController;
use App\Http\Controllers\QuincenaController;
use App\Http\Controllers\RegistroLecheController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\SocioController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => 'AgroLact API',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/auth/me', function (Request $request) {
        return response()->json(['status' => 'ok', 'data' => $request->user()]);
    });

    // Gestion de usuarios: solo Administrador
    Route::middleware('role:ADMINISTRADOR')->group(function () {
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::post('/usuarios', [UsuarioController::class, 'store']);
        Route::patch('/usuarios/{usuario}', [UsuarioController::class, 'update']);
    });

    // Gestion de socios: Administrador, Presidente
    Route::middleware('role:ADMINISTRADOR,PRESIDENTE')->group(function () {
        Route::get('/socios', [SocioController::class, 'index']);
        Route::get('/socios/{socio}', [SocioController::class, 'show']);
        Route::post('/socios', [SocioController::class, 'store']);
        Route::patch('/socios/{socio}', [SocioController::class, 'update']);

        Route::get('/quincenas', [QuincenaController::class, 'index']);
        Route::post('/quincenas', [QuincenaController::class, 'store']);
        Route::patch('/quincenas/{quincena}/precio', [QuincenaController::class, 'definirPrecio']);
        Route::post('/quincenas/{quincena}/cerrar', [QuincenaController::class, 'cerrar']);
        Route::get('/quincenas/{quincena}/liquidaciones', [QuincenaController::class, 'liquidaciones']);

        Route::post('/gastos-operativos', [GastoOperativoController::class, 'store']);
        Route::get('/gastos-operativos/actual', [GastoOperativoController::class, 'delaActual']);

        Route::post('/adelantos', [AdelantoController::class, 'store']);
        Route::get('/socios/{socio}/adelantos-pendientes', [AdelantoController::class, 'pendientesPorSocio']);

        Route::patch('/registros-leche/{registro}/corregir', [RegistroLecheController::class, 'corregir']);
        Route::get('/socios/{socio}/registros-leche', [RegistroLecheController::class, 'historialPorSocio']);

        Route::get('/reportes/produccion/{socio}', [ReporteController::class, 'produccionPorSocio']);
        Route::get('/reportes/produccion', [ReporteController::class, 'produccionTotal']);
        Route::get('/reportes/estado-cuenta/{socio}', [ReporteController::class, 'estadoCuentaPorSocio']);
        Route::get('/reportes/adelantos-pendientes', [ReporteController::class, 'adelantosPendientes']);
    });

    // Consultada por todos los roles autenticados
    Route::get('/quincenas/actual', [QuincenaController::class, 'actual']);

    // Registro de litros: Administrador, Presidente, Recepcionista
    Route::middleware('role:ADMINISTRADOR,PRESIDENTE,RECEPCIONISTA')->group(function () {
        Route::post('/registros-leche', [RegistroLecheController::class, 'store']);
        Route::get('/registros-leche', [RegistroLecheController::class, 'delDia']);
        Route::get('/quincenas/{quincena}/registros-leche', [RegistroLecheController::class, 'porQuincena']);
    });

    // Ventas de tienda: Administrador, Encargado de tienda
    Route::middleware('role:ADMINISTRADOR,ENCARGADO_TIENDA')->group(function () {
        Route::get('/productos', [TiendaController::class, 'productos']);
        Route::post('/productos', [TiendaController::class, 'storeProducto']);
        Route::post('/ventas-tienda', [TiendaController::class, 'storeVenta']);
        Route::get('/socios/{socio}/fiados-pendientes', [TiendaController::class, 'fiadosPendientesPorSocio']);
        Route::get('/reportes/fiados-pendientes', [ReporteController::class, 'fiadosPendientes']);
    });
});
