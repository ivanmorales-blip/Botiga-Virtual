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
            Schema::create('asignacion_caracteristicas', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('caracteristica_id');
                $table->foreign('caracteristica_id')->references('id')->on('caracteristicas')->onDelete('cascade');
                $table->unsignedBigInteger('producto_id');
                $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('asignacion_caracteristicas');
        }
    };
