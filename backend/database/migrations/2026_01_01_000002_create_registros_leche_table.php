<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_leche', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('socio_id')->constrained('socios');
            $table->foreignUuid('quincena_id')->constrained('quincenas');
            $table->date('fecha');
            $table->enum('jornada', ['MANANA', 'TARDE']);
            $table->decimal('litros', 8, 2);
            $table->foreignUuid('registrado_por')->constrained('usuarios');
            $table->timestamps();

            $table->unique(['socio_id', 'fecha', 'jornada']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_leche');
    }
};
