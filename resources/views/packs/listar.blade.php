@extends('layouts.app')

@section('content')
<div class="p-8 bg-gray-50 min-h-screen">

    <h1 class="text-3xl font-bold mb-8 text-orange-500 text-center">
        Llista de Packs
    </h1>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @forelse($packs as $pack)

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition">

            <!-- Header -->
            <div class="flex justify-between items-start mb-4">

                <span class="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                    Pack
                </span>

                <!-- Delete Button -->
                <form action="{{ route('packs.destroy', $pack->id) }}" method="POST" onsubmit="return confirm('Segur que vols eliminar aquest pack?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                            class="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold"
                            title="Eliminar Pack">

                        <svg class="h-4 w-4">
                            <use href="{{ asset('icons/sprite.svg#icon-trash') }}"></use>
                        </svg>

                        Eliminar
                    </button>
                </form>

            </div>

            <!-- Pack Name -->
            <h2 class="text-xl font-bold text-gray-800 mb-1">
                {{ $pack->nom }}
            </h2>

            <!-- Description -->
            <p class="text-gray-600 text-sm mb-3">
                {{ $pack->Descripcio }}
            </p>

            <!-- Price -->
            <p class="text-sm text-orange-500 font-semibold mb-3">
                {{ $pack->preu }} €
            </p>

            <!-- Product count -->
            <p class="text-gray-500 text-sm mb-4">
                {{ $pack->productes->count() ?? 0 }} productes
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between">

                <span class="text-sm text-gray-400">
                    Pack ID #{{ $pack->id }}
                </span>

                <!-- Secondary edit button -->
                <a href="{{ route('packs.edit', $pack->id) }}"
                   class="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition">
                    Editar Pack
                </a>

            </div>

        </div>

        @empty

        <div class="col-span-full text-center text-gray-500">
            No hi ha packs disponibles
        </div>

@endforelse
    </div>

    <!-- Back button -->
    <div class="mt-10 text-center">
        <a href="{{ route('packs.create') }}"
           class="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition">
            Tornar al menú
        </a>
    </div>

</div>
@endsection