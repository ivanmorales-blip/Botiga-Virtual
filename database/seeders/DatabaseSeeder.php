<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\TipoCaracteristica;
use App\Models\Caracteristica;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

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

                Usuario::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'nombre' => 'Admin',
                'apellidos' => 'System',
                'telefono' => '000000000',
                'direccion' => 'Admin HQ',
                'dni' => 'ADMIN001',
                'password' => Hash::make('admin123'),
                'admin' => true,
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
        $cilindreCategory = Categoria::where('tipo', 'Cilindre')->first();

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
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x30 Niquel Securemme K1',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 26.50,
                'stock' => 2,
                'marca' => 'Securemme',
                'estat' => 1,
            ],
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x30 Llautó Securemme K1',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 26.50,
                'stock' => 2,
                'marca' => 'Securemme',
                'estat' => 1,
            ],
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x30 Niquel Securemme K1 DE',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 42.00,
                'stock' => 1,
                'marca' => 'Securemme',
                'estat' => 1,
            ],
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x30 Llautó Securemme K1 DE',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 42.00,
                'stock' => 1,
                'marca' => 'Securemme',
                'estat' => 1,
            ],
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x40 Niquel Securemme K1',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 30.00,
                'stock' => 2,
                'marca' => 'Securemme',
                'estat' => 1,
            ],
            [
                'categoria_id' => $cilindreCategory->id,
                'nombre' => 'Cilindre 30x40 Llautó Securemme K1',
                'descripcion' => "Sistema de seguretatamb sistema d'encriptació de 6 pins actius, clau d'obra, totes les claus son de llautó Leva DIN 30 Antibumping i anti manipulació",
                'precio' => 30.00,
                'stock' => 2,
                'marca' => 'Securemme',
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
            ['tipo' => 'Targeta de propietat', 'Descripcio' => 'Inclou targeta de propietat'],
            ['tipo' => 'Mida interna', 'Descripcio' => 'Medida interna'],
            ['tipo' => 'Mida externa', 'Descripcio' => 'Medida externa'],
            ['tipo' => 'Doble Embrage', 'Descripcio' => 'doble embrage'],
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
            ['tipo' => 'Tipus clau', 'descripcio' => 'Element Mobil'], //0
            ['tipo' => 'Tipus clau', 'descripcio' => 'Punts copiables'], 
            ['tipo' => 'Tipus clau', 'descripcio' => 'Codificador magnètic'], 
            ['tipo' => 'Tipus clau', 'descripcio' => 'Punts incopiables'],

            // Nivell de seguretat
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Seguretat'], // 4
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Alta seguretat'],
            ['tipo' => 'Nivell de seguretat', 'descripcio' => 'Molt alta seguretat'],

            // Color
            ['tipo' => 'Color', 'descripcio' => 'Plata'], // 7
            ['tipo' => 'Color', 'descripcio' => 'Daurat'],

            // Targeta de propietat
            ['tipo' => 'Targeta de propietat', 'descripcio' => 'Inclou targeta'], // 9

            // Mesuras
            ['tipo' => 'Mida interna', 'descripcio' => 'Interna: 30mm'], // 10
            ['tipo' => 'Mida externa', 'descripcio' => 'Externa: 30mm'],
            ['tipo' => 'Mida interna', 'descripcio' => 'Interna: 40mm'],
            ['tipo' => 'Mida externa', 'descripcio' => 'Externa: 40mm'], 
            ['tipo' => 'Mida interna', 'descripcio' => 'Interna: 32mm'],
            ['tipo' => 'Mida externa', 'descripcio' => 'Externa: 32mm'],

            // Doble embrage
            ['tipo' => 'Doble Embrage', 'descripcio' => 'Doble embrague: Si'], // 16
            ['tipo' => 'Doble Embrage', 'descripcio' => 'Doble embrague: No'],
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

            $products[2]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[7]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[11]->id,
                //Doble Embrage
                $caracteristicas[17]->id,
            ]);

                $products[3]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[8]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[11]->id,
                //Doble Embrage
                $caracteristicas[17]->id,
            ]);

                $products[4]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[7]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[11]->id,
                //Doble Embrage
                $caracteristicas[16]->id,
            ]);

                $products[5]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[8]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[11]->id,
                //Doble Embrage
                $caracteristicas[16]->id,
            ]);
            $products[6]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[7]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[13]->id,
                //Doble Embrage
                $caracteristicas[17]->id,
            ]);
            $products[7]->caracteristicas()->sync([
                // Tipus clau
                $caracteristicas[1]->id,
                // Nivell Seguretat
                $caracteristicas[4]->id,
                // Color
                $caracteristicas[8]->id,
                // Tarjeta
                $caracteristicas[9]->id,
                // Mesures 
                $caracteristicas[10]->id,
                $caracteristicas[13]->id,
                //Doble Embrage
                $caracteristicas[17]->id,
            ]);
        }

        $this->command->info('Database seeded successfully!');
    }
}