<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\TipoCaracteristica;
use App\Models\Caracteristica;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // -----------------------
        // Users
        // -----------------------
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // -----------------------
        // Categories
        // -----------------------
        $categories = ['Escut', 'Bombin', 'Cilindre', 'Segon Pany'];
        foreach ($categories as $tipo) {
            Categoria::firstOrCreate(['tipo' => $tipo], ['estat' => 1]);
        }

        $escutCategory = Categoria::where('tipo', 'Escut')->first();
        $bombinCategory = Categoria::where('tipo', 'Bombin')->first();

        // -----------------------
        // Products
        // -----------------------
        $productsData = [
            [
                'categoria_id' => $escutCategory->id,
                'nombre' => 'Kit Escut Básico',
                'descripcion' => 'Kit inicial para Escut',
                'precio' => 25.50,
                'stock' => 5,
                'marca' => 'Abus',
                'estat' => 1,
            ],
            [
                'categoria_id' => $bombinCategory->id,
                'nombre' => 'Bombin Test',
                'descripcion' => 'Producto de prueba para Bombin',
                'precio' => 40.00,
                'stock' => 10,
                'marca' => 'Keso',
                'estat' => 1,
            ],
        ];

        $products = [];
        foreach ($productsData as $data) {
            $products[] = Producto::firstOrCreate(
                ['nombre' => $data['nombre']],
                $data
            );
        }

        // -----------------------
        // TipoCaracteristica
        // -----------------------
        $tipos = [
            ['tipo' => 'Tipus clau', 'Descripcio' => 'Tipus de clau per productes'],
            ['tipo' => 'Nivell de seguretat', 'Descripcio' => 'Seguretat del producte'],
            ['tipo' => 'Color', 'Descripcio' => 'Color disponible'],
            ['tipo' => 'Targeta de propietat', 'Descripcio' => 'Inclou targeta de propietat']
        ];

        $tipoMap = [];

        foreach ($tipos as $tipoData) {
            $tipoMap[$tipoData['tipo']] = TipoCaracteristica::firstOrCreate(
                ['tipo' => $tipoData['tipo']],
                ['Descripcio' => $tipoData['Descripcio']]
            );
        }

        // -----------------------
        // Caracteristicas
        // -----------------------
        $caracteristicasData = [
            // Tipus clau
            ['tipo' => 'Tipus clau', 'descripcio' => 'Element Mobil'],
            ['tipo' => 'Tipus clau', 'descripcio' => 'Punts copiables'],
            ['tipo' => 'Tipus clau', 'descripcio' => 'Codificador magnètic'],
            ['tipo' => 'Tipus clau', 'descripcio' => 'Punts incopiables'],

            // Nivell de seguretat
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Seguretat'],
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Alta seguretat'],
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Molt alta seguretat'],

            // Color
            ['tipo' => 'Color', 'descripcio' => 'Plata'],
            ['tipo' => 'Color', 'descripcio' => 'Daurat'],

            // Targeta de propietat
            ['tipo' => 'Targeta de propietat', 'descripcio' => 'Inclou targeta'],
        ];

        $caracteristicas = [];
        foreach ($caracteristicasData as $c) {
            $caracteristicas[] = Caracteristica::firstOrCreate([
                'tipo_id' => $tipoMap[$c['tipo']]->id,
                'descripcio' => $c['descripcio'],
            ], [
                'estat' => 1
            ]);
        }

        // -----------------------
        // Assign Caracteristicas to Products
        // -----------------------
        if (!empty($products) && !empty($caracteristicas)) {
            // Assign first 2 características to first product, next 3 to second product as example
            $products[0]->caracteristicas()->sync([
                $caracteristicas[0]->id,
                $caracteristicas[1]->id,
            ]);

            $products[1]->caracteristicas()->sync([
                $caracteristicas[2]->id,
                $caracteristicas[3]->id,
                $caracteristicas[4]->id,
            ]);
        }

        $this->command->info('Database seeded successfully!');
    }
}