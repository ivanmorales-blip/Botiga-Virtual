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
        $packs = Pack::with(['productes'])->get();
        return response()->json($packs);
    }

    /**
     * Store a new pack
     */
    public function store(Request $request)
    {
        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
        ]);

        // 🔥 Attach products WITH quantity
        if ($request->has('productes')) {
            $syncData = [];

            foreach ($request->productes as $prod) {
                $syncData[$prod['id']] = ['quantity' => $prod['quantity']];
            }

            $pack->productes()->sync($syncData);
        }

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

        $pack->update([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
        ]);

        if ($request->has('productes')) {
            $syncData = [];

            foreach ($request->productes as $prod) {
                $syncData[$prod['id']] = ['quantity' => $prod['quantity']];
            }

            $pack->productes()->sync($syncData);
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