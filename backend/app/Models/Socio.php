<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombres', 'cedula', 'celular', 'activo'])]
class Socio extends Model
{
    use HasUuids;

    protected $table = 'socios';

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function registrosLeche(): HasMany
    {
        return $this->hasMany(RegistroLeche::class);
    }

    public function liquidaciones(): HasMany
    {
        return $this->hasMany(Liquidacion::class);
    }

    public function adelantos(): HasMany
    {
        return $this->hasMany(Adelanto::class);
    }

    public function ventasTienda(): HasMany
    {
        return $this->hasMany(VentaTienda::class);
    }
}
