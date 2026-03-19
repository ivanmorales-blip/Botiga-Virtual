<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * List all products
     */
    public function index()
    {
        $products = Producto::with('categoria')->get();
        return response()->json($products, 200);
    }

    /**
     * Store a new product
     */
    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'stock' => 'required|integer|min:0',
        'descripcion' => 'nullable|string',
        'categoria_id' => 'nullable|exists:categorias,id',
    ]);

    $producto = Producto::create([
        'nombre' => $request->nombre,
        'precio' => $request->precio,
        'stock' => $request->stock,
        'descripcion' => $request->descripcion,
        'categoria_id' => $request->categoria_id,
        'estat' => true,
    ]);

    return response()->json($producto, 201); // ✅ MUST return JSON
}

    /**
     * Show a specific product
     */
    public function show($id)
    {
        $producto = Producto::with('categoria')->findOrFail($id);
        return response()->json($producto, 200);
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'precio' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|exists:categorias,id',
            'estat' => 'sometimes|boolean',
        ]);

        $producto->update($request->only([
            'nombre',
            'precio',
            'stock',
            'descripcion',
            'categoria_id',
            'estat',
        ]));

        return response()->json($producto, 200);
    }

    /**
     * Deactivate a product (set estat = false)
     */
    public function deactivate($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['estat' => false]);

        return response()->json($producto, 200);
    }

    /**
     * Activate a product (set estat = true)
     */
    public function activate($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['estat' => true]);

        return response()->json($producto, 200);
    }

    /**
     * Delete a product (only if estat = false)
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        if ($producto->estat) {
            return response()->json([
                'message' => 'Cannot delete active product. Deactivate first.'
            ], 403);
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto deleted successfully'
        ], 200);
    }
}