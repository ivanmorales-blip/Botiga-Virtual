<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pack;
use App\Models\Producto;
use App\Models\PackImage;

class PackController extends Controller
{
    public function index()
    {
        // Load products and images
        $packs = Pack::with(['productes', 'images'])->get();
        return response()->json($packs);
    }

    public function store(Request $request)
    {
        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
        ]);

        // Attach products with quantity
        if ($request->has('productes')) {
            $syncData = [];
            foreach ($request->productes as $prod) {
                $syncData[$prod['id']] = ['quantity' => $prod['quantity']];
            }
            $pack->productes()->sync($syncData);
        }

        // Attach images with order
        if ($request->has('images')) {
            foreach ($request->images as $img) {
                PackImage::create([
                    'pack_id' => $pack->id,
                    'image_path' => $img['path'], // expected path from frontend upload
                    'order' => $img['order'] ?? 0
                ]);
            }
        }

        return response()->json($pack->load(['productes', 'images']), 201);
    }

    public function show($id)
    {
        $pack = Pack::with(['productes', 'images'])->findOrFail($id);
        return response()->json($pack, 200);
    }

    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $pack->update([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
        ]);

        // Sync products
        if ($request->has('productes')) {
            $syncData = [];
            foreach ($request->productes as $prod) {
                $syncData[$prod['id']] = ['quantity' => $prod['quantity']];
            }
            $pack->productes()->sync($syncData);
        }

        // Sync images: delete old, add new
        if ($request->has('images')) {
            $pack->images()->delete();
            foreach ($request->images as $img) {
                PackImage::create([
                    'pack_id' => $pack->id,
                    'image_path' => $img['path'],
                    'order' => $img['order'] ?? 0
                ]);
            }
        }

        return response()->json($pack->load(['productes', 'images']));
    }

    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();
        return response()->json(['message' => 'Pack deleted successfully'], 200);
    }
}