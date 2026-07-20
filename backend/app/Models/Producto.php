<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'unidad_medida', 'activo'])]
class Producto extends Model
{
    use HasUuids;

    protected $table = 'productos';

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(VentaTienda::class);
    }
}
