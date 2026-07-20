<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $resultado = $this->authService->login(
            $request->validated('email'),
            $request->validated('password'),
        );

        return response()->json(['status' => 'ok', 'data' => $resultado]);
    }
}
