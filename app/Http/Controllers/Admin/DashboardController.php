<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Pack;
use App\Models\Feature;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'categoriesCount' => Category::count(),
            'productsCount' => Product::count(),
            'packsCount' => Pack::count(),
            'featuresCount' => Feature::count(),
            'latestProducts' => Product::latest()->take(5)->get()
        ]);
    }
}