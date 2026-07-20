<?php

namespace App\Http\Middleware;

use App\Enums\Rol;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$rolesPermitidos): Response
    {
        $rol = $request->user()?->rol;

        if (! $rol instanceof Rol || ! in_array($rol->value, $rolesPermitidos, true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tiene permisos para esta accion',
            ], 403);
        }

        return $next($request);
    }
}
