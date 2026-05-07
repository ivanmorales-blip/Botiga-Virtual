<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CaracteristicaController;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\SolucionsController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\TipoCaracteristicasController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (NO AUTH REQUIRED)
|--------------------------------------------------------------------------
*/

Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/recent', [ProductoController::class, 'recent']);

Route::get('/frontend/productos', [ProductoController::class, 'indexWithRelations']);
Route::get('/frontend/productos/{id}', [ProductoController::class, 'showWithRelations']);
Route::get('/frontend/categorias', [CategoriaController::class, 'indexWithProducts']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | CART
    |--------------------------------------------------------------------------
    */
    Route::get('/cart', [CarritoController::class, 'get']);
    Route::post('/cart/add', [CarritoController::class, 'add']);
    Route::post('/cart/remove', [CarritoController::class, 'remove']);
    Route::post('/cart/update', [CarritoController::class, 'update']);

    /*
    |--------------------------------------------------------------------------
    | PEDIDOS (USER)
    |--------------------------------------------------------------------------
    */

});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (AUTH + ADMIN ONLY)
|--------------------------------------------------------------------------
*/
Route::apiResource('caracteristicas', CaracteristicaController::class);
Route::middleware(['auth', 'admin'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PRODUCT MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('packs', PackController::class);
    
    Route::apiResource('solucions', SolucionsController::class);
});


    /*
    |--------------------------------------------------------------------------
    | PEDIDOS MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::put('/pedido/{id}/status', [PedidoController::class, 'updateStatus']);
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('packs', PackController::class);
    
    Route::apiResource('solucions', SolucionsController::class);
    Route::apiResource('caracteristicas', CaracteristicaController::class);
    Route::patch('/categorias/{id}/deactivate', [CategoriaController::class, 'deactivate']);

    Route::get('/tipos-caracteristicas', [TipoCaracteristicasController::class, 'index']);
    Route::post('/tipos-caracteristicas', [TipoCaracteristicasController::class, 'store']);