<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;

class ProductoController extends Controller
{
    public function index()
    {
        $products = Producto::with('categoria')->get();
        return view('producto.listarproducto', compact('products'));
    }

    public function create()
    {
        $categorias = Categoria::all();
        return view('producto.altaproducto', compact('categorias'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric',
            'stock' => 'nullable|integer',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        Producto::create($request->only(['nombre','descripcion','precio','stock','categoria_id']));

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente');
    }

    public function edit($id)
    {
        $product = Producto::findOrFail($id);
        $categorias = Categoria::all();
        return view('producto.edit', compact('product','categorias'));
    }

    public function update(Request $request, $id)
    {
        $product = Producto::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric',
            'stock' => 'nullable|integer',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        $product->update($request->only(['nombre','descripcion','precio','stock','categoria_id']));

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente');
    }

    public function destroy($id)
    {
        $product = Producto::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}