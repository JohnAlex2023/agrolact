<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas_tienda', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('socio_id')->constrained('socios');
            $table->foreignUuid('quincena_id')->constrained('quincenas');
            $table->foreignUuid('producto_id')->constrained('productos');
            $table->enum('tipo', ['CONTADO', 'FIADO']);
            $table->decimal('cantidad', 10, 2);
            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('total', 12, 2);
            $table->boolean('descontado')->default(false);
            $table->foreignUuid('registrado_por')->constrained('usuarios');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas_tienda');
    }
};
