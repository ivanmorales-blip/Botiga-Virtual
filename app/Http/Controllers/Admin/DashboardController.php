<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Pack;
use App\Models\Caracteristica;

class DashboardController extends Controller
{
    public function index()
    {
        $lowStock = \App\Models\Producto::orderBy('stock', 'asc')
        ->take(10)
        ->get();
        
        return view('admin.dashboard', [
            'categoriesCount' => Categoria::count(),
            'productsCount' => Producto::count(),
            'packsCount' => Pack::count(),
            'featuresCount' => Caracteristica::count(),
            'latestProducts' => Producto::latest()->take(5)->get(),

            'lowStock' => $lowStock,
        ]);
    }

    
}