<?php

namespace App\Models;

use App\Enums\Jornada;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['socio_id', 'quincena_id', 'fecha', 'jornada', 'litros', 'registrado_por'])]
class RegistroLeche extends Model
{
    use HasUuids;

    protected $table = 'registros_leche';

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'jornada' => Jornada::class,
            'litros' => 'decimal:2',
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

    public function registrador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'registrado_por');
    }

    public function correcciones(): HasMany
    {
        return $this->hasMany(CorreccionLeche::class, 'registro_id');
    }
}
