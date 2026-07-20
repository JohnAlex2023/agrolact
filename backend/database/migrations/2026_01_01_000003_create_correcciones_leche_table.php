<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('correcciones_leche', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('registro_id')->constrained('registros_leche');
            $table->decimal('valor_anterior', 8, 2);
            $table->decimal('valor_nuevo', 8, 2);
            $table->text('observacion');
            $table->foreignUuid('corregido_por')->constrained('usuarios');
            $table->timestamp('corregido_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('correcciones_leche');
    }
};
