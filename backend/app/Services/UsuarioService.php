<?php

namespace App\Services;

use App\Models\Usuario;
use App\Repositories\UsuarioRepository;
use Illuminate\Database\Eloquent\Collection;

class UsuarioService
{
    public function __construct(protected UsuarioRepository $usuarios) {}

    public function listar(): Collection
    {
        return $this->usuarios->todos();
    }

    public function crear(array $datos): Usuario
    {
        return $this->usuarios->create($datos);
    }

    public function editar(string $id, array $datos): Usuario
    {
        $usuario = $this->usuarios->findOrFail($id);

        if (empty($datos['password'])) {
            unset($datos['password']);
        }

        return $this->usuarios->update($usuario, $datos);
    }
}
