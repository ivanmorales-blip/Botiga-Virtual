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
            'productes' => 'nullable|array'
        ]);

        // Save the pack data
        $pack = Pack::create($request->only(['nom', 'Descripcio', 'preu']));

        // Insert products manually (duplicates allowed)
        if ($request->has('productes')) {
            $rows = collect($request->productes)->map(function($productId) use ($pack) {
                return [
                    'packs_id' => $pack->id,
                    'producte_id' => $productId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            \DB::table('productos_pack')->insert($rows);
        }

        return redirect()->route('packs.index')->with('success', 'Pack guardado correctamente.');
    }

    public function show($id)
    {
        $pack = Pack::with('productes')->findOrFail($id);
        return view('packs.show', compact('pack'));
    }

    public function edit(Pack $pack)
{
    $products = Producto::all();
    return view('packs.alta', compact('pack', 'products'));
}

    public function update(Request $request, Pack $pack)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'Descripcio' => 'required|string',
            'preu' => 'required|integer',
            'productes' => 'nullable|array'
        ]);

        $pack->update($request->only(['nom', 'Descripcio', 'preu']));

        // Delete old pivot rows and insert new ones manually to allow duplicates
        \DB::table('productos_pack')->where('packs_id', $pack->id)->delete();

        if ($request->has('productes')) {
            $rows = collect($request->productes)->map(function($productId) use ($pack) {
                return [
                    'packs_id' => $pack->id,
                    'producte_id' => $productId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            \DB::table('productos_pack')->insert($rows);
        }

        return redirect()->route('packs.index')->with('success', 'Pack actualitzat correctament.');
    }

    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();
        return redirect()->route('packs.index');
    }
}