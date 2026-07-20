<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\UsuarioRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(protected UsuarioRepository $usuarios) {}

    public function login(string $email, string $password): array
    {
        $usuario = $this->usuarios->findByEmail($email);

        if (! $usuario || ! $usuario->activo || ! Hash::check($password, $usuario->password)) {
            throw new AppException('Credenciales invalidas', 401);
        }

        $token = Auth::guard('api')->login($usuario);

        return [
            'token' => $token,
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'email' => $usuario->email,
                'rol' => $usuario->rol->value,
            ],
        ];
    }
}
