<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CaracteristicaController;

// Health check
Route::get('/ping', function () {
    return response()->json(['message' => 'pong del laravel']);
});

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
// Products for frontend display
Route::get('/frontend/productos', [ProductoController::class, 'indexWithRelations']);
Route::get('/frontend/productos/{id}', [ProductoController::class, 'showWithRelations']);

// Categories with their products
Route::get('/frontend/categorias', [CategoriaController::class, 'indexWithProducts']);

Route::get('/productos/recent', [ProductoController::class, 'recent']);

?>