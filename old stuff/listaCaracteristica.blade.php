@extends('layouts.app')

@section('content')
<div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-orange-500 text-center">
        Llistat de Característiques
    </h1>

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
            <thead class="bg-orange-100">
                <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">#</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Descripció</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Tipo</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-sm">Accions</th>
                </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
                @foreach($caracteristicas as $caracteristica)
                    <tr id="row-{{ $caracteristica->id }}" class="hover:bg-orange-50 transition duration-200 cursor-pointer">

                        <td class="px-6 py-4 text-gray-600 font-medium">{{ $caracteristica->id }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ $caracteristica->descripcio }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ $caracteristica->tipo->descripcion ?? 'N/A' }}</td>

                        <td class="px-6 py-4 flex space-x-3">
                            <form action="{{ route('caracteristicas.destroy', $caracteristica->id) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-500 hover:text-red-600 transition"
                                        title="Eliminar">
                                    <svg class="h-6 w-6" aria-label="Eliminar">
                                        <use href="{{ asset('icons/sprite.svg#icon-trash') }}"></use>
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