<?php

namespace App\Services;

use App\Enums\AccionAuditoria;
use App\Models\Auditoria;

class AuditoriaService
{
    public function registrar(
        string $usuarioId,
        string $entidad,
        AccionAuditoria $accion,
        ?string $registroId = null,
        ?array $datosAnteriores = null,
        ?array $datosNuevos = null,
    ): Auditoria {
        return Auditoria::create([
            'usuario_id' => $usuarioId,
            'entidad' => $entidad,
            'registro_id' => $registroId,
            'accion' => $accion,
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $datosNuevos,
        ]);
    }
}
