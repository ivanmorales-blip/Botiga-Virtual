@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#f5f5f7] p-10">

    <h1 class="text-4xl font-semibold text-gray-900 mb-10">
        Pantalla de inicio
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Categories</p>
            <h2 class="text-3xl font-semibold">{{ $categoriesCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Productos</p>
            <h2 class="text-3xl font-semibold">{{ $productsCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Packs</p>
            <h2 class="text-3xl font-semibold">{{ $packsCount }}</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
            <p class="text-gray-500 text-sm">Caracteristicas</p>
            <h2 class="text-3xl font-semibold">{{ $featuresCount }}</h2>
        </div>

    </div>

    <div class="bg-white rounded-3xl shadow-sm p-8">
        <h3 class="text-xl font-semibold mb-6">Ultimos Products</h3>

        <ul>
            @foreach($latestProducts as $product)
                <li class="py-2 border-b text-gray-600">
                    {{ $product->name }}
                </li>
            @endforeach
        </ul>
    </div>

</div>
@endsection