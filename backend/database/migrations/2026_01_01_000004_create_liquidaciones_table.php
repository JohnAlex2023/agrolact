<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('liquidaciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('quincena_id')->constrained('quincenas');
            $table->foreignUuid('socio_id')->constrained('socios');
            $table->decimal('total_litros', 10, 2)->default(0);
            $table->decimal('valor_bruto', 12, 2)->default(0);
            $table->decimal('descuento_adelantos', 12, 2)->default(0);
            $table->decimal('descuento_fiados', 12, 2)->default(0);
            $table->decimal('saldo_deuda_anterior', 12, 2)->default(0);
            $table->decimal('neto_pagar', 12, 2)->default(0);
            $table->decimal('saldo_nuevo', 12, 2)->default(0);
            $table->timestamps();

            $table->unique(['quincena_id', 'socio_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('liquidaciones');
    }
};
