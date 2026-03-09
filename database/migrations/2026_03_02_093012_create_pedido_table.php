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
        Schema::create('pedido', function (Blueprint $table) {
            $table->id();
            $table->dateTime('data');
            $table->integer('total');
            $table->unsignedBigInteger('usuari_id')->nullable();
            $table->foreign('usuari_id')->references('id')->on('usuario')->onDelete('cascade');
            $table->text('estat');
            $table->text('direccio');
            $table->integer('telefon')->nullable();
            $table->text('email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido');
    }
};
