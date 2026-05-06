<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\DetallePedido;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

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

public function userPedidos(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $pedidos = Pedido::with([
        'detalles.producto',
        'detalles.pack'
    ])
    ->where('usuari_id', $userId)
    ->orderBy('created_at', 'desc')
    ->get();

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
    if (!auth()->check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $userId = auth()->id();
    $cart = $request->cart ?? [];

    if (!is_array($cart) || empty($cart)) {
        return response()->json(['error' => 'Cart empty'], 400);
    }

    $total = 0;

    foreach ($cart as $item) {
        $product = \App\Models\Producto::find($item['id']);

        if (!$product) continue;

        $total += $product->precio * $item['quantity'];
    }

    $pedido = Pedido::create([
        'data' => now(),
        'total' => $total,
        'usuari_id' => $userId,
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

public function downloadPdf($id)
{
    $pedido = Pedido::with([
        'detalles.producto',
        'detalles.pack'
    ])->findOrFail($id);

    $pdf = PDF::loadView('pedidos.pdf', [
        'pedido' => $pedido
    ]);

    return $pdf->download("pedido-{$pedido->id}.pdf");
}   
}