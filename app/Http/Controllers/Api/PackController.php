<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pack;
use App\Models\Producte;

class PackController extends Controller
{
    /**
     * List all packs with related products
     */
    public function index()
    {
        $packs = Pack::with('productes')->get();
        return response()->json($packs, 200);
    }

    /**
     * Store a new pack
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'Descripcio' => 'required|string',
            'preu' => 'required|integer',
            'productes' => 'sometimes|array'
        ]);

        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
            'estat' => true, // always true on creation
        ]);

        if ($request->has('productes')) {
            $pack->productes()->sync($request->productes);
        }

        $pack->load('productes');

        return response()->json($pack->load('productes'), 201);
    }

    /**
     * Show a specific pack
     */
    public function show($id)
    {
        $pack = Pack::with('productes')->findOrFail($id);
        return response()->json($pack, 200);
    }

    /**
     * Update a pack
     */
    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'Descripcio' => 'sometimes|string',
            'preu' => 'sometimes|integer',
            'estat' => 'sometimes|boolean', // allow updating the state
            'productes' => 'sometimes|array'
        ]);

        $pack->update($request->only(['nom', 'Descripcio', 'preu', 'estat']));

        $pack->update($request->only(['nom', 'Descripcio', 'preu']));
        if ($request->has('productes')) {
            $pack->productes()->sync($request->productes);
        }

        return response()->json($pack->load('productes'));
    }

    /**
     * Delete a pack
     */
    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();

        return response()->json([
            'message' => 'Pack deleted successfully'
        ], 200);
    }
}