<?php

namespace App\Models;

use App\Enums\EstadoQuincena;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['fecha_inicio', 'fecha_fin', 'precio_litro', 'estado', 'creado_por'])]
class Quincena extends Model
{
    use HasUuids;

    protected $table = 'quincenas';

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'precio_litro' => 'decimal:2',
            'estado' => EstadoQuincena::class,
        ];
    }

    public function creador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'creado_por');
    }

    public function registrosLeche(): HasMany
    {
        return $this->hasMany(RegistroLeche::class);
    }

    public function liquidaciones(): HasMany
    {
        return $this->hasMany(Liquidacion::class);
    }

    public function ventasTienda(): HasMany
    {
        return $this->hasMany(VentaTienda::class);
    }

    public function gastosOperativos(): HasMany
    {
        return $this->hasMany(GastoOperativo::class);
    }
}
