<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

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