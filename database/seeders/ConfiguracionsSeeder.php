<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class ConfiguracionsSeeder extends Seeder {
    public function run(): void {
        \DB::table('configuracions')->delete();
        \DB::table('configuracions')->insert([
            ['clau' => 'enviament',    'valor' => 9.00,   'descripcio' => 'Despeses d\'enviament (Espanya)',          'created_at' => now(), 'updated_at' => now()],
            ['clau' => 'install_0',    'valor' => 90.00,  'descripcio' => 'Instal·lació fins a 250€',                 'created_at' => now(), 'updated_at' => now()],
            ['clau' => 'install_250',  'valor' => 120.00, 'descripcio' => 'Instal·lació de 250€ a 500€',              'created_at' => now(), 'updated_at' => now()],
            ['clau' => 'install_500',  'valor' => 180.00, 'descripcio' => 'Instal·lació de 500€ a 1.000€',            'created_at' => now(), 'updated_at' => now()],
            ['clau' => 'install_1000', 'valor' => null,   'descripcio' => 'Instal·lació més de 1.000€ (a consultar)', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}