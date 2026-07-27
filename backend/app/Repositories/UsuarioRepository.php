<?php

namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository
{
    public function findByEmail(string $email): ?Usuario
    {
        return Usuario::where('email', $email)->first();
    }

    public function findOrFail(string $id): Usuario
    {
        return Usuario::findOrFail($id);
    }

    public function todos(): Collection
    {
        return Usuario::orderBy('nombre')->get();
    }

    public function create(array $datos): Usuario
    {
        return Usuario::create($datos);
    }

    public function update(Usuario $usuario, array $datos): Usuario
    {
        $usuario->update($datos);

        return $usuario;
    }
}
