<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('socios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombres');
            $table->string('cedula')->unique();
            $table->string('celular');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('socios');
    }
};
