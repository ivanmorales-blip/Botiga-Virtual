<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Pack;

class CatalogController extends Controller
{
    /**
     * Get a single catalog item (product or pack)
     * Used for cart hydration / frontend display
     */
    public function getItem(Request $request)
    {
        $id = $request->id;
        $isPack = filter_var($request->isPack, FILTER_VALIDATE_BOOLEAN);

        if (!$id) {
            return response()->json([
                'message' => 'Missing id'
            ], 400);
        }

        // 📦 PACK
        if ($isPack) {
            $pack = Pack::with('images', 'productes')->find($id);

            if (!$pack) {
                return response()->json([
                    'message' => 'Pack not found'
                ], 404);
            }

            return response()->json([
                'id' => $pack->id,
                'type' => 'pack',
                'nombre' => $pack->nom,
                'precio' => (float) $pack->preu,

                // first image or null
                'imagen' => $pack->images->first()
                    ? $pack->images->first()->image_path
                    : null,

                // optional: pack contents (useful for UI)
                'items' => $pack->productes->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'nombre' => $p->nombre,
                        'quantity' => $p->pivot->quantity ?? 1,
                    ];
                }),
            ]);
        }

        // 📦 PRODUCT
        // 📦 PRODUCT
        $product = Producto::with('imatges')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'id' => $product->id,
            'type' => 'product',
            'nombre' => $product->nombre,
            'precio' => (float) $product->precio,
            'imagen' => $product->imatges->first()
                ? $product->imatges->first()->path
                : null,
        ]);
    }

    /**
     * OPTIONAL: bulk fetch (recommended upgrade for cart)
     */
    public function getItems(Request $request)
    {
        $items = $request->items; 
        // expected: [{id:1,isPack:false}, ...]

        if (!is_array($items)) {
            return response()->json([
                'message' => 'Invalid items format'
            ], 400);
        }

        $result = [];

        foreach ($items as $item) {
            $id = $item['id'] ?? null;
            $isPack = $item['isPack'] ?? false;

            if (!$id) continue;

            if ($isPack) {
                $pack = Pack::with('images')->find($id);

                if ($pack) {
                    $result[] = [
                        'id' => $pack->id,
                        'type' => 'pack',
                        'nombre' => $pack->nom,
                        'precio' => (float) $pack->preu,
                        'imagen' => $pack->images->first()?->image_path,
                    ];
                }
            } else {
                $product = Producto::with('imatges')->find($id);
                if ($product) {
                    $result[] = [
                        'id' => $product->id,
                        'type' => 'product',
                        'nombre' => $product->nombre,
                        'precio' => (float) $product->precio,
                        'imagen' => $product->imatges->first()?->path,
                    ];
                }
            }
        }

        return response()->json($result);
    }
}