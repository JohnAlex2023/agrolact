<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['registro_id', 'valor_anterior', 'valor_nuevo', 'observacion', 'corregido_por'])]
class CorreccionLeche extends Model
{
    use HasUuids;

    protected $table = 'correcciones_leche';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'valor_anterior' => 'decimal:2',
            'valor_nuevo' => 'decimal:2',
            'corregido_en' => 'datetime',
        ];
    }

    public function registro(): BelongsTo
    {
        return $this->belongsTo(RegistroLeche::class, 'registro_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'corregido_por');
    }
}
