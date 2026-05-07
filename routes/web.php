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
| AUTH
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

    Route::get('/profile', fn () => view('Frontend.Profile'))
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // USER ORDERS
    Route::get('/my-pedidos', [PedidoController::class, 'userPedidos'])
        ->name('user.pedidos');

    Route::get('/pedido/{id}/pdf', [PedidoController::class, 'downloadPdf'])
        ->name('pedido.pdf');


    Route::get('/my-pedidos', [PedidoController::class, 'userPedidos']);
});

/*
|--------------------------------------------------------------------------
| ADMIN AREA (AUTH + ADMIN)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::get('/pedidos', fn () => view('pedidos.pedidos'))
        ->name('pedidos.index');

    Route::view('/solucions', 'formularisolucions.list')
        ->name('solucions.admin');

    // React admin pages
    Route::get('/products-react', fn () => view('producto.products-list'))
        ->name('products.react.list');

    Route::get('/categorias-react', fn () => view('categorias.categorias-react'))
        ->name('categorias.react.list');

    Route::get('/caracteristicas-react', fn () => view('caracteristicas.caracteristicalist-react'))
        ->name('caracteristicas.react.list');

    Route::get('/packs-react', fn () => view('packs.packslista-react'))
        ->name('packs.react.list');

    Route::get('/configuracions', fn () => view('configuracions.configuracions')) 
        ->name('admin.configuracions');
});

/*
|--------------------------------------------------------------------------
| PUBLIC REACT PAGES
|--------------------------------------------------------------------------
*/

// Products
Route::get('/products-react', fn () => view('producto.products-list'))
    ->name('products.react.public');

Route::get('/products-react/create', fn () => view('producto.product-create'))
    ->name('products.react.create');

// Packs
Route::get('/packs-react', fn () => view('packs.packslista-react'))
    ->name('packs.react.public');

Route::get('/packs-react/create', fn () => view('packs.packcreate-react'))
    ->name('packs.react.create');

Route::get('/packs-react/{id}/edit', fn ($id) =>
    view('packs.packedit-react', ['id' => $id])
)->name('packs.react.edit');

// Categories
Route::get('/categorias-react', fn () => view('categorias.categorias-react'))
    ->name('categorias.react.public');

Route::get('/categorias-productos', fn () =>
    view('CategoriaProductos.categoriasproductos-react')
)->name('categorias.productos');

// Características
Route::get('/caracteristicas-react', fn () =>
    view('caracteristicas.caracteristicalist-react')
)->name('caracteristicas.react.public');

// Soluciones create (THIS WAS MISSING PROPERLY)
Route::view('/solucions/create', 'formularisolucions.create')
    ->name('solucions.create');

/*
|--------------------------------------------------------------------------
| CART
|--------------------------------------------------------------------------
*/
Route::view('/cart-page', 'Frontend.Carrito')
    ->name('cart.page');

Route::get('/api/cart', [CarritoController::class, 'get']);
Route::post('/cart/remove', [CarritoController::class, 'remove']);
Route::post('/cart/update', [CarritoController::class, 'update']);

/*
|--------------------------------------------------------------------------
| PAYPAL
|--------------------------------------------------------------------------
*/
Route::get('/paypal/pay/{pedido}', [PaypalController::class, 'createPayment'])
    ->name('paypal.pay');

Route::get('/paypal/success', [PaypalController::class, 'success'])
    ->name('paypal.success');

Route::get('/paypal/cancel', [PaypalController::class, 'cancel'])
    ->name('paypal.cancel');

/*
|--------------------------------------------------------------------------
| DEBUG (OPTIONAL)
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

Route::get('/debug-user', function () {
    return [
        'check' => auth()->check(),
        'user' => auth()->user(),
    ];
});

/*
|--------------------------------------------------------------------------
| USER BRIDGE
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


Route::post('/pedido', [PedidoController::class, 'store']);

/*
|--------------------------------------------------------------------------
| AUTH DEFAULT
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';