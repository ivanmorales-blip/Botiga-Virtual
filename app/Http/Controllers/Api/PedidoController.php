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

public function index()
{
    $pedidos = Pedido::with([
        'detalles.producto',
        'detalles.pack',
        'usuario'
    ])->orderBy('created_at', 'desc')->get();

    return response()->json($pedidos);
}

public function updateStatus(Request $request, $id)
{
    $pedido = Pedido::find($id);

    if (!$pedido) {
        return response()->json(['error' => 'Pedido not found'], 404);
    }

    $request->validate([
        'estat' => 'required|string'
    ]);

    $pedido->estat = $request->estat;
    $pedido->save();

    return response()->json([
        'message' => 'Status updated',
        'pedido' => $pedido
    ]);
}

public function store(Request $request)
{
    $userId = $request->usuari_id;

    if (!$userId) {
        return response()->json([
            'message' => 'Missing user id'
        ], 422);
    }

    $cart = $request->cart ?? [];

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
        'usuari_id' => $userId, // ✔ FROM FRONTEND
        'estat' => 'En process',
        'direccio' => $request->direccio ?? 'N/A',
        'telefon' => $request->telefon ?? null,
        'email' => $request->email ?? null,
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