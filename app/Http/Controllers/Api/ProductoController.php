<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::query();

        // Filtrar por categoría si viene
        if ($request->filled('categoria')) {
            $query->where('categoria_id', $request->categoria);
        }

        // Filtrar por característica si viene
        if ($request->filled('caracteristica')) {
            $query->whereHas('caracteristicas', function ($q) use ($request) {
                $q->where('id', $request->caracteristica);
            });
        }

        // Cargar las características junto con el producto
        $productos = $query->with('caracteristicas')->get();

        return response()->json($productos);
    }

    // New function to fetch all products with categories & characteristics
    public function indexWithRelations()
    {
        $productos = Producto::with('categoria', 'caracteristicas')
            ->where('estat', true)   // only active
            ->get();

        return response()->json($productos, 200);
    }

    // Fetch single product with expanded info
    public function showWithRelations($id)
    {
        $producto = Producto::with('categoria', 'caracteristicas')
            ->findOrFail($id);

        return response()->json($producto, 200);
    }

public function recent()
{
    $products = Producto::with('categoria')
        ->where('estat', true)              // only active products
        ->where('created_at', '>=', now()->subDays(30)) // last 30 days
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    return response()->json($products, 200);
}

    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'stock' => 'required|integer|min:0',
        'descripcion' => 'nullable|string',
        'categoria_id' => 'nullable|exists:categorias,id',
        'marca' => 'nullable|string|max:255',
        'caracteristicas' => 'nullable|array',
        'caracteristicas.*' => 'exists:caracteristicas,id'
    ]);

    $producto = Producto::create([
        'nombre' => $request->nombre,
        'precio' => $request->precio,
        'stock' => $request->stock,
        'descripcion' => $request->descripcion,
        'categoria_id' => $request->categoria_id,
        'marca' => $request->marca,
        'estat' => true,
    ]);

    if ($request->has('caracteristicas')) {
        $producto->caracteristicas()->sync($request->caracteristicas);
    }

    $producto->load(['categoria', 'caracteristicas.tipo']);

    return response()->json($producto, 201);
}

    public function show($id)
    {
        $producto = Producto::with([
            'categoria',
            'caracteristicas.tipo'
        ])->findOrFail($id);
        return response()->json($producto, 200);
    }

    public function update(Request $request, $id)
{
    $producto = Producto::findOrFail($id);

    $producto->update([
        'nombre' => $request->nombre,
        'precio' => $request->precio,
        'stock' => $request->stock,
        'descripcion' => $request->descripcion,
        'categoria_id' => $request->categoria_id,
        'marca' => $request->marca,
    ]);

    if ($request->has('caracteristicas')) {
        $producto->caracteristicas()->sync($request->caracteristicas);
    }

    return response()->json([
        'message' => 'Producte actualitzat correctament'
    ]);
}

    public function deactivate($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['estat' => false]);
        return response()->json($producto, 200);
    }

    public function activate($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['estat' => true]);
        return response()->json($producto, 200);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        if ($producto->estat) {
            return response()->json([
                'message' => 'Cannot delete active product. Deactivate first.'
            ], 403);
        }

        $producto->delete();

        return response()->json(['message' => 'Producto deleted successfully'], 200);
    }
    public function productosPorCategoriaYCaracteristica($categoriaId, $caracteristicaId)
    {
        $productos = Producto::with(['categoria', 'caracteristicas'])
            ->where('categoria_id', $categoriaId)
            ->whereHas('caracteristicas', function ($query) use ($caracteristicaId) {
                $query->where('caracteristicas.id', $caracteristicaId);
            })
            ->where('estat', true)
            ->get();

        return response()->json($productos, 200);
    }
}