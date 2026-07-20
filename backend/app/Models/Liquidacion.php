<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'quincena_id', 'socio_id', 'total_litros', 'valor_bruto',
    'descuento_adelantos', 'descuento_fiados', 'saldo_deuda_anterior',
    'neto_pagar', 'saldo_nuevo',
])]
class Liquidacion extends Model
{
    use HasUuids;

    protected $table = 'liquidaciones';

    protected function casts(): array
    {
        return [
            'total_litros' => 'decimal:2',
            'valor_bruto' => 'decimal:2',
            'descuento_adelantos' => 'decimal:2',
            'descuento_fiados' => 'decimal:2',
            'saldo_deuda_anterior' => 'decimal:2',
            'neto_pagar' => 'decimal:2',
            'saldo_nuevo' => 'decimal:2',
        ];
    }

    public function quincena(): BelongsTo
    {
        return $this->belongsTo(Quincena::class);
    }

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class);
    }

    public function abonos(): HasMany
    {
        return $this->hasMany(AbonoAdelanto::class);
    }
}
