<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['quincena_id', 'concepto', 'valor', 'registrado_por'])]
class GastoOperativo extends Model
{
    use HasUuids;

    protected $table = 'gastos_operativos';

    protected function casts(): array
    {
        return ['valor' => 'decimal:2'];
    }

    public function quincena(): BelongsTo
    {
        return $this->belongsTo(Quincena::class);
    }

    public function registrador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'registrado_por');
    }
}
