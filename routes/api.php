<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CaracteristicaController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\Api\PedidoController;

// Health check
Route::get('/ping', function () {
    return response()->json(['message' => 'pong del laravel']);
});

use App\Http\Controllers\Api\ProductoController;

// Recent products
Route::get('productos/recent', [ProductoController::class, 'recent'])->name('api.productos.recent');

// All products (with relations)
Route::get('frontend/productos', [ProductoController::class, 'indexWithRelations']);
Route::get('frontend/productos/{id}', [ProductoController::class, 'showWithRelations']);

// API resources (all under /api automatically)
Route::apiResource('categorias', CategoriaController::class)
     ->names([
         'index' => 'api.categorias.index',
         'store' => 'api.categorias.store',
         'show' => 'api.categorias.show',
         'update' => 'api.categorias.update',
         'destroy' => 'api.categorias.destroy',
     ]);

Route::apiResource('packs', PackController::class)
     ->names([
         'index' => 'api.packs.index',
         'store' => 'api.packs.store',
         'show' => 'api.packs.show',
         'update' => 'api.packs.update',
         'destroy' => 'api.packs.destroy',
     ]);

Route::apiResource('productos', ProductoController::class)
     ->names([
         'index' => 'api.productos.index',
         'store' => 'api.productos.store',
         'show' => 'api.productos.show',
         'update' => 'api.productos.update',
         'destroy' => 'api.productos.destroy',
     ]);

    Route::post('productos/{id}/deactivate', [ProductoController::class, 'deactivate']);
    Route::post('productos/{id}/activate', [ProductoController::class, 'activate']);

use App\Http\Controllers\Api\TipoCaracteristicasController;

Route::get('/caracteristicas/tipos', [TipoCaracteristicasController::class, 'index']);
Route::post('/tipo-caracteristicas', [TipoCaracteristicasController::class, 'store']);

Route::apiResource('caracteristicas', CaracteristicaController::class)
     ->names([
         'index' => 'api.caracteristicas.index',
         'store' => 'api.caracteristicas.store',
         'update' => 'api.caracteristicas.update',
         'destroy' => 'api.caracteristicas.destroy',
     ]);

Route::get('/categorias/{categoria}/caracteristicas/{caracteristica}/productos', [ProductoController::class, 'productosPorCategoriaYCaracteristica']);

Route::get('/caracteristicas', [CaracteristicaController::class, 'index']);
Route::get('/categorias/{id}/productos', [ProductoController::class, 'productosPorCategoria']);


// Products for frontend display
Route::get('/frontend/productos', [ProductoController::class, 'indexWithRelations']);
Route::get('/frontend/productos/{id}', [ProductoController::class, 'showWithRelations']);

// Categories with their products
Route::get('/frontend/categorias', [CategoriaController::class, 'indexWithProducts']);

Route::get('productos/recent', [ProductoController::class, 'recent'])->name('api.productos.recent');

Route::patch('/productos/{id}/activate', [ProductoController::class, 'activate']);
Route::patch('/productos/{id}/deactivate', [ProductoController::class, 'deactivate']);

Route::post('/productos', [ProductoController::class, 'store']);

use App\Http\Controllers\Api\SolucionsController;

Route::get('/solucions', [SolucionsController::class, 'index']);
Route::get('/solucions/{id}', [SolucionsController::class, 'show']);
Route::post('/solucions', [SolucionsController::class, 'store']);
Route::delete('/solucions/{id}', [Solucionscontroller::class, 'destroy']);

Route::apiResource('solucions', SolucionsController::class);

use Illuminate\Support\Facades\Auth;

Route::get('/user', function () {
    return response()->json(Auth::user());
});


Route::post('/pedido', [PedidoController::class, 'store']);

Route::post('/packs/{id}/toggle', [PackController::class, 'toggleActive']);

    Route::post('/cart/add', [CarritoController::class, 'add']);
    Route::get('/api/cart', [CarritoController::class, 'get']);
    Route::post('/cart/remove', [CarritoController::class, 'remove']);
    Route::post('/cart/update', [CarritoController::class, 'update']);


Route::middleware('auth:web')->get('/user', function (Request $request) {
    return response()->json($request->user());
});
?>