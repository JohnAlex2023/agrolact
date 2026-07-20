<?php

namespace App\Models;

use App\Enums\TipoVenta;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'socio_id', 'quincena_id', 'producto_id', 'tipo', 'cantidad',
    'precio_unitario', 'total', 'descontado', 'registrado_por',
])]
class VentaTienda extends Model
{
    use HasUuids;

    protected $table = 'ventas_tienda';

    protected function casts(): array
    {
        return [
            'tipo' => TipoVenta::class,
            'cantidad' => 'decimal:2',
            'precio_unitario' => 'decimal:2',
            'total' => 'decimal:2',
            'descontado' => 'boolean',
        ];
    }

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class);
    }

    public function quincena(): BelongsTo
    {
        return $this->belongsTo(Quincena::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function registrador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'registrado_por');
    }
}
