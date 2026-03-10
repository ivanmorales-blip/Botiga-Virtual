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
        return response()->json($categorias);
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
        ]);

        return response()->json($categoria, 201);
    }

    /**
     * Show a specific category
     */
    public function show($id)
    {
        $categoria = Categoria::findOrFail($id);
        return response()->json($categoria);
    }

    /**
     * Update a category
     */
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'tipo' => 'sometimes|string|max:255',
        ]);

        $categoria->update($request->only(['tipo']));

        return response()->json($categoria);
    }

    /**
     * Delete a category
     */
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return response()->json([
            'message' => 'Categoria deleted successfully'
        ]);
    }
}