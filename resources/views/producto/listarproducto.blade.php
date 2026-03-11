@extends('layouts.app')

@section('content')
<div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-orange-500 text-center">
        Llistat de Productes
    </h1>

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
            <thead class="bg-orange-100">
                <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">#</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Nom</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Descripció</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Preu</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Stock</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Categoria</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Estat</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Accions</th>
                </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
                @foreach($products as $product)
                    <tr class="hover:bg-orange-50 transition duration-200 cursor-pointer">

                        <!-- ID -->
                        <td class="px-6 py-4 text-gray-600 font-medium">{{ $product->id }}</td>

                        <!-- Nombre -->
                        <td class="px-6 py-4 text-gray-700">{{ $product->nombre }}</td>

                        <!-- Descripción -->
                        <td class="px-6 py-4 text-gray-700">{{ $product->descripcion ?? 'N/A' }}</td>

                        <!-- Precio -->
                        <td class="px-6 py-4 text-gray-700">{{ number_format($product->precio, 2) }} €</td>

                        <!-- Stock -->
                        <td class="px-6 py-4 text-gray-700">{{ $product->stock }}</td>

                        <!-- Categoría -->
                        <td class="px-6 py-4 text-gray-700">{{ $product->categoria->tipo ?? 'N/A' }}</td>

                        <!-- Estado -->
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 rounded-full font-semibold text-sm 
                                {{ $product->actiu ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800' }}">
                                {{ $product->actiu ? 'Actiu' : 'Inactiu' }}
                            </span>
                        </td>

                        <!-- Acciones -->
                        <td class="px-6 py-4 flex space-x-3">

                            <!-- Editar -->
                            <a href="{{ route('productos.edit', $product->id) }}" 
                               class="text-orange-400 hover:text-orange-500 transition" 
                               title="Editar">
                                <svg class="h-6 w-6" aria-label="Editar">
                                    <use href="{{ asset('icons/sprite.svg#icon-edit') }}"></use>
                                </svg>
                            </a>

                            <!-- Activar / Desactivar -->
                            <form action="{{ route('productos.active', $product->id) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <button type="submit" class="text-sm transition"
                                        title="{{ $product->actiu ? 'Desactivar' : 'Activar' }}">
                                    <svg class="h-6 w-6 {{ $product->actiu ? 'text-red-400 hover:text-red-500' : 'text-green-400 hover:text-green-500' }}"
                                        aria-label="{{ $product->actiu ? 'Desactivar' : 'Activar' }}">
                                        <use href="{{ asset('icons/sprite.svg#' . ($product->actiu ? 'icon-x' : 'icon-check')) }}"></use>
                                    </svg>
                                </button>
                            </form>

                    

                        </td>

                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection