@extends('layouts.app')

@section('content')
<div class="min-h-screen p-10">

    <h1 class="text-4xl font-semibold text-gray-900 mb-10">
        Pantalla d'inici
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Categories</p>
            <h2 class="text-3xl font-semibold">{{ $categoriesCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Productes</p>
            <h2 class="text-3xl font-semibold">{{ $productsCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Packs</p>
            <h2 class="text-3xl font-semibold">{{ $packsCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Caracteristiques</p>
            <h2 class="text-3xl font-semibold">{{ $featuresCount }}</h2>
        </div>

    </div>

    <!-- <div class="bg-white rounded-3xl shadow-sm p-8">
        <h3 class="text-xl font-semibold mb-6">Últims Productes</h3>

        <ul>
            @foreach($latestProducts as $product)
                <li class="py-2 border-b text-gray-600">
                    {{ $product->name }}
                </li>
            @endforeach
        </ul>
    </div>
    !-->

    <div class="bg-white rounded-3xl shadow-sm p-8 mt-10" style="width: 900px;">
        <h3 class="text-xl font-semibold mb-6">Productes amb menys stock</h3>

        <canvas id="stockChart"></canvas>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        const stockData = @json($lowStock);

        const labels = stockData.map(p => p.nombre);
        const values = stockData.map(p => p.stock);

        new Chart(document.getElementById('stockChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock disponible',
                    data: values,
                    backgroundColor: 'rgba(251, 146, 60, 0.4)',
                    borderColor: 'rgba(249, 115, 22, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    x: {
                    ticks: {
                        color: 'black' // letras eje X
                    }
                    },
                    y: {
                        ticks: {
                            color: 'black' // números eje Y
                    }
                    }
                }
            }
        });
    </script>

</div>
@endsection