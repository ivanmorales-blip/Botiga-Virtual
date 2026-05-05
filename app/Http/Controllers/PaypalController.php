<?php

namespace App\Http\Controllers;

use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Models\Pedido;
use Illuminate\Http\Request;

class PayPalController extends Controller
{
public function createPayment($pedidoId)
{
    $pedido = Pedido::findOrFail($pedidoId);

    $provider = new PayPalClient;
    $provider->setApiCredentials(config('paypal'));
    $provider->getAccessToken();

    $response = $provider->createOrder([
        "intent" => "CAPTURE",
        "purchase_units" => [
            [
                "amount" => [
                    "currency_code" => "EUR",
                    "value" => number_format($pedido->total, 2, '.', '')
                ]
            ]
        ],
        "application_context" => [
            "return_url" => url("/paypal/success?pedido_id={$pedido->id}"),
            "cancel_url" => url("/paypal/cancel?pedido_id={$pedido->id}")
        ]
    ]);

    // 🔍 Safety check
    if (!isset($response['links']) || !is_array($response['links'])) {
        return redirect("/profile")
            ->with("error", "Error creando pago en PayPal");
    }

    // 🔁 Find approval URL
    foreach ($response['links'] as $link) {
        if (($link['rel'] ?? null) === 'approve') {
            return redirect($link['href']);
        }
    }

    // ❌ Fallback if approve link is missing
    return redirect("/profile")
        ->with("error", "No se pudo obtener el enlace de pago");
}

    
public function success(Request $request)
{
    $pedido = Pedido::findOrFail($request->pedido_id);

    $provider = new PayPalClient;
    $provider->setApiCredentials(config('paypal'));
    $provider->getAccessToken();

    $response = $provider->capturePaymentOrder($request->token);

    if (($response['status'] ?? null) === 'COMPLETED') {
        $pedido->estat = "Pagado";
        $pedido->save();

        return redirect("/profile")->with("success", "Pago completado");
    }

    return redirect("/profile")->with("error", "Pago no completado");
}

    public function cancel()
    {
        return redirect("/profile")->with("error", "Pago cancelado");
    }
}