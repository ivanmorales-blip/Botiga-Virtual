<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\CaracteristicaController;

// Redirigir la raíz al dashboard del admin
Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Rutas del panel de administración
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Test conexión base de datos
Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return 'Conexión a la base de datos correcta!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Categorías
Route::resource('categorias', CategoriaController::class);

// Productos
Route::resource('productos', ProductoController::class);

// Packs
Route::resource('packs', PackController::class);

// Caracteristicas
Route::resource('caracteristicas', CaracteristicaController::class);