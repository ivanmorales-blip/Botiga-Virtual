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
        Schema::create('solucions', function (Blueprint $table) {
            $table->id();
            $table->text('descripcio');
            $table->string('correu_electronic');
            $table->string('telefon');
            $table->string('estat');
            $table->timestamps();
        });
    }

    /*<label className="form-field w-full">
            <span className="form-label">{t('shop.custom_solution.attachments')}</span>
            <input type="file" className="file-input file-input-bordered w-full" multiple accept="image/*,.pdf" onChange={handleFiles} />
          </label> */

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solucions');
    }
};
