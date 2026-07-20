<?php

namespace App\Models;

use App\Enums\Rol;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

#[Fillable(['nombre', 'email', 'password', 'rol', 'activo'])]
#[Hidden(['password'])]
class Usuario extends Authenticatable implements JWTSubject
{
    use HasUuids;

    protected $table = 'usuarios';

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'rol' => Rol::class,
            'activo' => 'boolean',
        ];
    }

    public function getJWTIdentifier(): string
    {
        return (string) $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return ['rol' => $this->rol->value];
    }
}
