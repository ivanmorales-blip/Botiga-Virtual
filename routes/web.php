<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\CarritoController;



// Redirect root to admin dashboard
Route::get('/', fn() => redirect()->route('admin.dashboard'));

// Admin dashboard
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// DB test
Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return 'Conexión correcta!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// --------------------
// React pages
// --------------------

// Products
Route::get('/products-react', fn() => view('producto.products-list'))
    ->name('products.react.list');

Route::get('/products-react/create', fn() => view('producto.product-create'))
    ->name('products.react.create');

// Packs
Route::get('/packs-react', fn() => view('packs.packslista-react'))
    ->name('packs.react.list');

Route::get('/packs-react/create', fn() => view('packs.packcreate-react'))
    ->name('packs.react.create');

Route::get('/packs-react/{id}/edit', fn($id) => view('packs.packedit-react', ['id' => $id]))
    ->name('packs.react.edit');

// Categorias
Route::get('/categorias-react', fn() => view('categorias.categorias-react'))
    ->name('categorias.react.list');

Route::get('/categorias/{id}/productos', [CategoriaController::class, 'productos']);

Route::get('/categorias-productos', function () {
    return view('CategoriaProductos.categoriasproductos-react');
})->name('categorias.productos');  // <- nombre de la ruta


// Caracteristicas
Route::get('/caracteristicas-react', fn() => view('caracteristicas.caracteristicalist-react'))
    ->name('caracteristicas.react.list');

Route::view('/solucions/create', 'formularisolucions.create')
    ->name('solucions.create');

Route::view('/admin/solucions', 'formularisolucions.list')
    ->name('solucions.admin');

//Carrito

Route::view('/cart-page', 'Frontend.Carrito')->name('cart.page');

Route::post('/cart/add', [CarritoController::class, 'add']);
Route::get('/api/cart', [CarritoController::class, 'get']);     
Route::post('/cart/remove', [CarritoController::class, 'remove']);
Route::post('/cart/update', [CarritoController::class, 'update']);
    
Route::get('/', function () {
    return view('Frontend.Frontpage');
})->name('home');