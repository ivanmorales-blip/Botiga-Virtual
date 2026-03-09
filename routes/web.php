<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductoController;

// Redirigir la raíz al dashboard del admin
Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Rutas del panel de administración
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return 'Conexión a la base de datos correcta!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Categorías
    Route::resource('categorias', \App\Http\Controllers\Admin\CategoryController::class);

    // Productos
    Route::resource('productos', \App\Http\Controllers\Admin\ProductoController::class);

    // Características
    Route::resource('caracteristicas', \App\Http\Controllers\CaracteristicaController::class);

    // Packs
    Route::resource('packs', \App\Http\Controllers\PackController::class);
