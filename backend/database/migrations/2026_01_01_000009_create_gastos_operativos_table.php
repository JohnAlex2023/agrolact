<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gastos_operativos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('quincena_id')->constrained('quincenas');
            $table->string('concepto');
            $table->decimal('valor', 12, 2);
            $table->foreignUuid('registrado_por')->constrained('usuarios');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos_operativos');
    }
};
