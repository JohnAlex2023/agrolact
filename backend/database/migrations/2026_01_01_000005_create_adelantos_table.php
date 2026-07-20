<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adelantos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('socio_id')->constrained('socios');
            $table->date('fecha');
            $table->decimal('valor', 12, 2);
            $table->decimal('abono_acordado', 12, 2)->nullable();
            $table->text('observacion')->nullable();
            $table->foreignUuid('registrado_por')->constrained('usuarios');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adelantos');
    }
};
