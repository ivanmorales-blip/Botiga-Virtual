<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Pack;
use App\Models\PackImage;

class PackController extends Controller
{
    public function index()
    {
        return Pack::with(['productes', 'images'])->get();
    }

    public function store(Request $request)
    {
        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
            'estat' => $request->estat ?? 1,
        ]);

        $this->syncProducts($pack, $request);
        $this->storeImages($pack, $request);

        return response()->json(
            $pack->load(['productes', 'images']),
            201
        );
    }

    public function show($id)
    {
        return Pack::with(['productes', 'images'])->findOrFail($id);
    }

    public function update(Request $request, $id)
{
    $pack = Pack::findOrFail($id);

    $pack->update([
        'nom' => $request->nom,
        'Descripcio' => $request->Descripcio,
        'preu' => $request->preu,
        'estat' => $request->estat ?? $pack->estat,
    ]);

    // PRODUCTS (safe decode)
    $this->syncProducts($pack, $request);

    // ----------------------------
    // IMAGES DELETE (FIXED)
    // ----------------------------
    $deleted = $request->input('deleted_images');

    if ($deleted) {
        $deleted = is_string($deleted)
            ? json_decode($deleted, true)
            : $deleted;

        if (is_array($deleted)) {
            foreach ($pack->images()->whereIn('id', $deleted)->get() as $img) {
                Storage::disk('public')->delete($img->image_path);
                $img->delete();
            }
        }
    }

    // ----------------------------
    // IMAGES ADD
    // ----------------------------
    $this->storeImages($pack, $request);

    return response()->json(
        $pack->load(['productes', 'images'])
    );
}

    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);

        foreach ($pack->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $pack->delete();

        return response()->json(['message' => 'deleted']);
    }

    public function toggleActive($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->estat = !$pack->estat;
        $pack->save();

        return $pack;
    }

    private function syncProducts($pack, $request)
{
    $raw = $request->input('productes');

    if (!$raw) return;

    $products = is_string($raw) ? json_decode($raw, true) : $raw;

    if (!is_array($products)) return;

    $sync = [];

    foreach ($products as $p) {
        if (!isset($p['id'])) continue;

        $sync[$p['id']] = [
            'quantity' => $p['quantity'] ?? 1
        ];
    }

    $pack->productes()->sync($sync);
}

        private function storeImages($pack, $request)
{
    if (!$request->hasFile('new_images')) return;

    $files = $request->file('new_images');
    $orders = $request->input('new_images_order', []);

    foreach ($files as $i => $file) {

        $path = $file->store('packs', 'public');

        PackImage::create([
            'pack_id' => $pack->id,
            'image_path' => $path,
            'order' => $orders[$i] ?? $i,
        ]);
    }
}
}