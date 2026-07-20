<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abonos_adelanto', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('adelanto_id')->constrained('adelantos');
            $table->foreignUuid('liquidacion_id')->constrained('liquidaciones');
            $table->decimal('monto', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abonos_adelanto');
    }
};
