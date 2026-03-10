<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PackController as PackApiController;
use App\Http\Controllers\Api\CategoriaController as CategoriaApiController;


Route::get('/ping', function (Request $request) {
    return response()->json([
        'message' => 'pong del laravel'
    ]);

});

Route::prefix('api')->group(function () {
    Route::apiResource('categorias', CategoriaApiController::class)
         ->names('api.categorias');
    Route::apiResource('packs', PackApiController::class)
         ->names('api.packs');
});

Route::apiResource('categorias', CategoriaApiController::class)
     ->names([
         'index' => 'api.categorias.index',
         'store' => 'api.categorias.store',
         'show' => 'api.categorias.show',
         'update' => 'api.categorias.update',
         'destroy' => 'api.categorias.destroy',
     ]);

Route::apiResource('packs', PackApiController::class)
     ->names([
         'index' => 'api.packs.index',
         'store' => 'api.packs.store',
         'show' => 'api.packs.show',
         'update' => 'api.packs.update',
         'destroy' => 'api.packs.destroy',
     ]);
?>