<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Mostrar la lista de categorías
     */
    public function index()
    {
        $categories = Category::all();
        return view('categorias.index', compact('categories'));
    }

    /**
     * Mostrar el formulario de alta de categoría
     */
    public function create()
    {
        return view('categorias.create');
    }

    /**
     * Guardar una nueva categoría
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.categorias.index')
                         ->with('success', 'Categoría creada correctamente');
    }

    /**
     * Mostrar una categoría específica (opcional)
     */
    public function show(Category $categoria)
    {
        return view('categorias.show', compact('categoria'));
    }

    /**
     * Mostrar el formulario de edición de categoría
     */
    public function edit(Category $categoria)
    {
        return view('categorias.edit', compact('categoria'));
    }

    /**
     * Actualizar una categoría
     */
    public function update(Request $request, Category $categoria)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $categoria->update([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.categorias.index')
                         ->with('success', 'Categoría actualizada correctamente');
    }

    /**
     * Eliminar una categoría
     */
    public function destroy(Category $categoria)
    {
        $categoria->delete();

        return redirect()->route('admin.categorias.index')
                         ->with('success', 'Categoría eliminada correctamente');
    }
}