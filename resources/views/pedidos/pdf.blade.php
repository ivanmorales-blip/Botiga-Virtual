<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pedido #{{ $pedido->id }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #ea580c; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f3f4f6; }
    </style>
</head>
<body>

<h1>Pedido #{{ $pedido->id }}</h1>

<p><strong>Estado:</strong> {{ $pedido->estat }}</p>
<p><strong>Total:</strong> {{ $pedido->total }}€</p>

<table>
    <thead>
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
        </tr>
    </thead>

    <tbody>
        @foreach($pedido->detalles as $detalle)
            @php
                $name = $detalle->producto->nombre ?? $detalle->pack->nombre ?? 'Pack';
                $lineTotal = $detalle->quantitat * $detalle->preuindividual;
            @endphp

            <tr>
                <td>{{ $name }}</td>
                <td>{{ $detalle->quantitat }}</td>
                <td>{{ $detalle->preuindividual }}€</td>
                <td>{{ $lineTotal }}€</td>
            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>