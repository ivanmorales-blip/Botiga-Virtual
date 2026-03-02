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
        Schema::create('productos_pack', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('packs_id');
            $table->foreign('caracteristica_id')->references('id')->on('packs')->onDelete('cascade');
            $table->unsignedBigInteger('producte_id');
            $table->foreign('producte_id')->references('id')->on('producte')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos_pack');
    }
};
