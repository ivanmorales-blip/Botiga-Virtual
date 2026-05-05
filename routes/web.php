<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\PaypalController;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => view('Frontend.Frontpage'))->name('home');

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| AUTH (CUSTOM LOGIN)
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PROFILE (AUTH REQUIRED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    Route::get('/profile', function () {
        return view('Frontend.Profile');
    })->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| DEBUG (KEEP ONLY IF NEEDED)
|--------------------------------------------------------------------------
*/
Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return 'Conexión correcta!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/debug-user', function (Request $request) {
    return [
        'check' => auth()->check(),
        'user' => auth()->user(),
    ];
});

/*
|--------------------------------------------------------------------------
| USER BRIDGE (IMPORTANT FOR YOUR FRONTEND)
|--------------------------------------------------------------------------
*/
Route::get('/auth/user-bridge', function () {
    $user = auth()->user();

    if (!$user) {
        return response()->json(null, 401);
    }

    return response()->json([
        'id' => $user->id,
        'name' => $user->nombre ?? $user->email ?? 'User'
    ]);
});

/*
|--------------------------------------------------------------------------
| REACT PAGES
|--------------------------------------------------------------------------
*/

// Products
Route::get('/products-react', fn () => view('producto.products-list'))->name('products.react.list');
Route::get('/products-react/create', fn () => view('producto.product-create'))->name('products.react.create');

// Packs
Route::get('/packs-react', fn () => view('packs.packslista-react'))->name('packs.react.list');
Route::get('/packs-react/create', fn () => view('packs.packcreate-react'))->name('packs.react.create');
Route::get('/packs-react/{id}/edit', fn ($id) => view('packs.packedit-react', ['id' => $id]))->name('packs.react.edit');

// Categories
Route::get('/categorias-react', fn () => view('categorias.categorias-react'))->name('categorias.react.list');
Route::get('/categorias/{id}/productos', [CategoriaController::class, 'productos']);

Route::get('/categorias-productos', function () {
    return view('CategoriaProductos.categoriasproductos-react');
})->name('categorias.productos');

// Features
Route::get('/caracteristicas-react', fn () => view('caracteristicas.caracteristicalist-react'))
    ->name('caracteristicas.react.list');

// Solutions
Route::view('/solucions/create', 'formularisolucions.create')->name('solucions.create');
Route::view('/admin/solucions', 'formularisolucions.list')->name('solucions.admin');

/*
|--------------------------------------------------------------------------
| CART (SESSION BASED - NO AUTH REQUIRED)
|--------------------------------------------------------------------------
*/
Route::view('/cart-page', 'Frontend.Carrito')->name('cart.page');

Route::get('/api/cart', [CarritoController::class, 'get']);
Route::post('/cart/remove', [CarritoController::class, 'remove']);
Route::post('/cart/update', [CarritoController::class, 'update']);


Route::view('/admin/pedidos', 'app'); 

Route::get('/admin/pedidos', function () {
    return view('pedidos.pedidos');
})->name('pedidos.index');

Route::get('/my-pedidos', [PedidoController::class, 'userPedidos'])
    ->middleware('auth');

    Route::get('/pedido/{id}/pdf', [PedidoController::class, 'downloadPdf'])
    ->middleware('auth');


Route::get('/paypal/pay/{pedido}', [PayPalController::class, 'createPayment']);
Route::get('/paypal/success', [PayPalController::class, 'success']);
Route::get('/paypal/cancel', [PayPalController::class, 'cancel']);
Route::get('/paypal/pay/{pedido}', [PaypalController::class, 'createPayment'])
    ->name('paypal.pay');

/*
|--------------------------------------------------------------------------
| LARAVEL DEFAULT AUTH FILES
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';