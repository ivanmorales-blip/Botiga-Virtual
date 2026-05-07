<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\DetallePedido;
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
        $userId = session()->get('user_id');

if (!$userId) {
    return response()->json([
        'message' => 'Unauthorized (no session user_id)'
    ], 401);
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

    \Log::info('SESSION DEBUG', [
    'session' => session()->all(),
    'user_id' => session('user_id'),
]);

    $userId = session('user_id');

    if (!$userId) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $cart = $request->cart ?? [];

    if (!is_array($cart) || empty($cart)) {
        return response()->json(['error' => 'Cart empty'], 400);
    }

    $total = 0;

    // 🧠 FIRST PASS: calculate total correctly
    foreach ($cart as $item) {

        if ($item['isPack']) {
            $pack = \App\Models\Pack::find($item['id']);
            if (!$pack) continue;

            $total += $pack->preu * $item['quantity'];
        } else {
            $product = \App\Models\Producto::find($item['id']);
            if (!$product) continue;

            $total += $product->precio * $item['quantity'];
        }
    }

    // 🧾 CREATE ORDER
    $pedido = Pedido::create([
        'data' => now(),
        'total' => $total,
        'usuari_id' => $userId,
        'estat' => 'En process',
        'direccio' => $request->direccio ?? 'N/A',
        'telefon' => $request->telefon ?? null,
        'email' => $request->email ?? null,
    ]);

    // 📦 SECOND PASS: store items correctly
    foreach ($cart as $item) {

        if ($item['isPack']) {
            $pack = \App\Models\Pack::find($item['id']);
            if (!$pack) continue;

            DetallePedido::create([
                'pedido_id' => $pedido->id,
                'producto_id' => null,
                'pack_id' => $pack->id,
                'quantitat' => $item['quantity'],
                'preuindividual' => $pack->preu,
            ]);

        } else {
            $product = \App\Models\Producto::find($item['id']);
            if (!$product) continue;

            DetallePedido::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $product->id,
                'pack_id' => null,
                'quantitat' => $item['quantity'],
                'preuindividual' => $product->precio,
            ]);
        }
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