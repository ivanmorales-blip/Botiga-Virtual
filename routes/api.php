<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CaracteristicaController;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\SolucionsController;
use App\Http\Controllers\CarritoController;

/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------
*/

Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/recent', [ProductoController::class, 'recent']);

/*
|--------------------------------------------------------------------------
| FRONTEND DATA
|--------------------------------------------------------------------------
*/

Route::get('/frontend/productos', [ProductoController::class, 'indexWithRelations']);
Route::get('/frontend/productos/{id}', [ProductoController::class, 'showWithRelations']);
Route::get('/frontend/categorias', [CategoriaController::class, 'indexWithProducts']);

/*
|--------------------------------------------------------------------------
| RESOURCES
|--------------------------------------------------------------------------
*/

Route::apiResource('categorias', CategoriaController::class);
Route::apiResource('packs', PackController::class);
Route::apiResource('caracteristicas', CaracteristicaController::class);
Route::apiResource('solucions', SolucionsController::class);

/*
|--------------------------------------------------------------------------
| CART (OK TO KEEP HERE)
|--------------------------------------------------------------------------
*/

Route::get('/cart', [CarritoController::class, 'get']);
Route::post('/cart/add', [CarritoController::class, 'add']);
Route::post('/cart/remove', [CarritoController::class, 'remove']);
Route::post('/cart/update', [CarritoController::class, 'update']);

use App\Http\Controllers\Api\PedidoController;

Route::post('/pedido', [PedidoController::class, 'store']);


Route::post('/pedido', [PedidoController::class, 'store']);
Route::get('/pedidos', [PedidoController::class, 'index']);
Route::put('/pedido/{id}/status', [PedidoController::class, 'updateStatus']);

Route::get('/my-pedidos', [PedidoController::class, 'userPedidos']);

