<?php

namespace Database\Seeders;

use App\Enums\Rol;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::updateOrCreate(
            ['email' => 'admin@agrolact.com'],
            [
                'nombre' => 'Administrador',
                'password' => 'admin123',
                'rol' => Rol::ADMINISTRADOR,
                'activo' => true,
            ]
        );
    }
}
