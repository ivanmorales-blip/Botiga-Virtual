<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CarritoController extends Controller
{
    public function add(Request $request)
    {
        $productId = $request->id;
        $quantity = $request->quantity ?? 1;
        $isPack = $request->isPack ?? false;

        $cart = session()->get('cart', []);

        $found = false;

        foreach ($cart as &$item) {
            if ($item['id'] == $productId) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $cart[] = [
                'id' => $productId,
                'quantity' => $quantity,
                'isPack' => $isPack
            ];
        }

        session()->put('cart', $cart);

        return response()->json([
            'message' => 'Product added to cart',
            'cart' => $cart
        ]);
    }

    public function get()
    {
        return response()->json(session()->get('cart', []));
    }

    

    public function remove(Request $request)
    {
        $cart = session()->get('cart', []);

        $cart = array_filter($cart, fn($item) => $item['id'] != $request->id);

        session()->put('cart', array_values($cart));

        return response()->json($cart);
    }

    public function update(Request $request)
    {
        $cart = session()->get('cart', []);

        foreach ($cart as &$item) {
            if ($item['id'] == $request->id) {
                $item['quantity'] = $request->quantity;
            }
        }

        session()->put('cart', $cart);

        return response()->json($cart);
    }
}