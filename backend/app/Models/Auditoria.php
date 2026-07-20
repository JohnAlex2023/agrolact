<?php

namespace App\Models;

use App\Enums\AccionAuditoria;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['usuario_id', 'entidad', 'registro_id', 'accion', 'datos_anteriores', 'datos_nuevos'])]
class Auditoria extends Model
{
    use HasUuids;

    protected $table = 'auditoria';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'accion' => AccionAuditoria::class,
            'datos_anteriores' => 'array',
            'datos_nuevos' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }
}
