<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pack;
use App\Models\Producto;

class PackController extends Controller
{
    public function index()
    {
        $packs = Pack::with('productes')->get();
        return view('packs.listar', compact('packs'));
    }

    public function create()
    {
        $products = Producto::all();
        return view('packs.alta', compact('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'Descripcio' => 'required|string',
            'preu' => 'required|integer',
            'productes' => 'array'
        ]);

        $pack = Pack::create($request->only(['nom', 'Descripcio', 'preu']));

        if ($request->has('productes')) {
            $pack->productes()->sync($request->productes);
        }

        return redirect()->route('packs.index');
    }

    public function show($id)
    {
        $pack = Pack::with('productes')->findOrFail($id);
        return view('packs.show', compact('pack'));
    }

    public function edit($id)
    {
        $pack = Pack::findOrFail($id);
        $productes = Producto::all();
        return view('packs.editar', compact('pack','productes'));
    }

    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'Descripcio' => 'sometimes|string',
            'preu' => 'sometimes|integer',
            'productes' => 'array'
        ]);

        $pack->update($request->only(['nom','Descripcio','preu']));

        if ($request->has('productes')) {
            $pack->productes()->sync($request->productes);
        }

        return redirect()->route('packs.index');
    }

    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();
        return redirect()->route('packs.index');
    }
}