<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\DetallePedido;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PedidoController extends Controller
{
public function store(Request $request)
{
    $data = $request->all();

    $cart = $data['cart'] ?? [];

    if (!is_array($cart) || count($cart) === 0) {
        return response()->json(['error' => 'Cart empty'], 400);
    }

    $total = 0;

    foreach ($cart as $item) {
        $product = \App\Models\Producto::find($item['id']);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found: ' . $item['id']
            ], 400);
        }

        $total += $product->precio * $item['quantity'];
    }

    $pedido = Pedido::create([
        'data' => now(),
        'total' => $total,
        'usuari_id' => $data['usuari_id'] ?? null,
        'estat' => 'En process',
        'direccio' => $data['direccio'] ?? 'N/A',
        'telefon' => $data['telefon'] ?? null,
        'email' => $data['email'] ?? null,
    ]);

    foreach ($cart as $item) {
        $product = \App\Models\Producto::find($item['id']);

        if (!$product) continue;

        DetallePedido::create([
            'pedido_id' => $pedido->id,
            'producto_id' => $item['isPack'] ? null : $item['id'],
            'pack_id' => $item['isPack'] ? $item['id'] : null,
            'quantitat' => $item['quantity'],
            'preuindividual' => $product->precio,
        ]);
    }

    return response()->json([
        'message' => 'Pedido creado',
        'pedido_id' => $pedido->id
    ]);
}
}