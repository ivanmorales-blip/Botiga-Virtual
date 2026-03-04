<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pack;

class PackController extends Controller
{
    /**
     * Display a listing of packs
     */
    public function index()
    {
        $packs = Pack::with('productes')->get();
        return response()->json($packs);
    }

    /**
     * Store a newly created pack
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'Descripcio' => 'required|string',
            'preu' => 'required|integer',
            'productes' => 'array' // array of product IDs
        ]);

        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu
        ]);

        // Attach products if provided
        if ($request->has('productes')) {
            $pack->productes()->attach($request->productes);
        }

        return response()->json($pack->load('productes'), 201);
    }

    /**
     * Display the specified pack
     */
    public function show($id)
    {
        $pack = Pack::with('productes')->findOrFail($id);
        return response()->json($pack);
    }

    /**
     * Update the specified pack
     */
    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'Descripcio' => 'sometimes|string',
            'preu' => 'sometimes|integer',
            'productes' => 'array'
        ]);

        $pack->update($request->only(['nom', 'Descripcio', 'preu']));

        // Sync products if provided
        if ($request->has('productes')) {
            $pack->productes()->sync($request->productes);
        }

        return response()->json($pack->load('productes'));
    }

    /**
     * Remove the specified pack
     */
    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();

        return response()->json([
            'message' => 'Pack deleted successfully'
        ]);
    }
}