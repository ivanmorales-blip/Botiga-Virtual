<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    /**
     * List all categories
     */
    public function index()
    {
        $categorias = Categoria::all();
        return response()->json($categorias, 200);
    }

    // New function to fetch categories with active products
    public function indexWithProducts()
    {
        $categorias = Categoria::where('estat', true)
            ->with(['productos' => function($query) {
                $query->where('estat', true)
                    ->with('caracteristicas');
            }])
            ->get();

        return response()->json($categorias, 200);
    }

    /**
     * Store a new category
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $categoria = Categoria::create([
            'tipo' => $request->tipo,
            'estat' => true, // always true on creation
        ]);

        return response()->json($categoria, 201);
    }

    /**
     * Show a specific category
     */
    public function show($id)
    {
        $categoria = Categoria::with('productos')->findOrFail($id);
        return response()->json($categoria, 200);
    }

    /**
     * Update a category
     */
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'tipo' => 'sometimes|string|max:255',
            'estat' => 'sometimes|boolean',
        ]);

        $categoria->update($request->only(['tipo', 'estat']));

        return response()->json($categoria, 200);
    }

    /**
     * Deactivate a category (set estat = false)
     */
    public function deactivate($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update(['estat' => false]);

        return response()->json($categoria, 200);
    }

    /**
     * Delete a category (only if estat = false)
     */
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);

        if ($categoria->estat) {
            return response()->json([
                'message' => 'Cannot delete active category. Deactivate first.'
            ], 403);
        }

        $categoria->delete();

        return response()->json([
            'message' => 'Categoria deleted successfully'
        ], 200);
    }

    public function productos($id)
    {
        $categoria = Categoria::with('productos')->findOrFail($id);

        // Devuelve solo los productos
        return response()->json($categoria->productos, 200);
    }
}