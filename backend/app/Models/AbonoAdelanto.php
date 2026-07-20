<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['adelanto_id', 'liquidacion_id', 'monto'])]
class AbonoAdelanto extends Model
{
    use HasUuids;

    protected $table = 'abonos_adelanto';

    protected function casts(): array
    {
        return ['monto' => 'decimal:2'];
    }

    public function adelanto(): BelongsTo
    {
        return $this->belongsTo(Adelanto::class);
    }

    public function liquidacion(): BelongsTo
    {
        return $this->belongsTo(Liquidacion::class);
    }
}
