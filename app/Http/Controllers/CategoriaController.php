<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::all();
        return view('categorias.listar', compact('categorias'));
    }

    public function create()
    {
        return view('categorias.alta');
    }

public function store(Request $request)
{
    // Validate input
    $request->validate([
        'tipo' => 'required|string|max:255',
    ]);

    // Create category
    Categoria::create($request->only(['tipo']));

    // Redirect back to the categories page (or wherever you want)
    return redirect()->route('categorias.index')
                     ->with('success', 'Categoria creada correctament!');
}

    public function show($id)
    {
        $categoria = Categoria::findOrFail($id);
        return view('categorias.show', compact('categoria'));
    }

    public function edit($id)
    {
        $categoria = Categoria::findOrFail($id);
        return view('categorias.editar', compact('categoria'));
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $categoria->update($request->only(['tipo']));

        return redirect()->route('categorias.index')
            ->with('success', 'Categoria actualitzada correctament!');
    }

    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return redirect()->route('categorias.index')
            ->with('success', 'Categoria eliminada correctament!');
    }
}