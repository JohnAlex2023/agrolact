<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quincenas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->decimal('precio_litro', 10, 2)->nullable();
            $table->enum('estado', ['ABIERTA', 'CERRADA'])->default('ABIERTA');
            $table->foreignUuid('creado_por')->constrained('usuarios');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quincenas');
    }
};
