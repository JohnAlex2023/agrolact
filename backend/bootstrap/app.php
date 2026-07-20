<?php

use App\Exceptions\AppException;
use App\Http\Middleware\EnsureRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['role' => EnsureRole::class]);
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (AppException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $e->statusCode());
        });

        $exceptions->render(function (ValidationException $e) {
            $errores = collect($e->errors())->map(
                fn ($mensajes, $campo) => ['campo' => $campo, 'mensaje' => $mensajes[0]]
            )->values();

            return response()->json([
                'status' => 'error',
                'message' => 'Datos invalidos',
                'errores' => $errores,
            ], 422);
        });
    })->create();
