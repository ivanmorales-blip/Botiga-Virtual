<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producte;
use App\Models\Categoria;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Producte::with('categoria')->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categorias = Categoria::all();
        return view('admin.products.create', compact('categorias'));
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'preu' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id'
        ]);

        Producte::create([
            'nom' => $request->nom,
            'preu' => $request->preu,
            'categoria_id' => $request->categoria_id
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Producto creado correctamente');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit($id)
    {
        $product = Producte::findOrFail($id);
        $categorias = Categoria::all();

        return view('admin.products.edit', compact('product', 'categorias'));
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Producte::findOrFail($id);

        $request->validate([
            'nom' => 'required|string|max:255',
            'preu' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id'
        ]);

        $product->update([
            'nom' => $request->nom,
            'preu' => $request->preu,
            'categoria_id' => $request->categoria_id
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id)
    {
        $product = Producte::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}