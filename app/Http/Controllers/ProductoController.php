<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;

class ProductoController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Producto::with('categoria')->paginate(10);
        return view('producto.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categorias = Categoria::all();
        return view('producto.create', compact('categorias'));
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

        Producto::create([
            'nom' => $request->nom,
            'preu' => $request->preu,
            'categoria_id' => $request->categoria_id
        ]);

        return redirect()->route('producto.index')->with('success', 'Producto creado correctamente');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit($id)
    {
        $product = Producto::findOrFail($id);
        $categorias = Categoria::all();

        return view('producto.edit', compact('product', 'categorias'));
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Producto::findOrFail($id);

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

        return redirect()->route('producto.index')->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id)
    {
        $product = Producto::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}