<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solucions_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('path');
            $table->string('tipus_arxiu');
            $table->unsignedBigInteger('tamany');
            $table->unsignedBigInteger('solucion_id');
            $table->foreign('solucion_id')->references('id')->on('solucions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solucions_attachments');
    }
};
