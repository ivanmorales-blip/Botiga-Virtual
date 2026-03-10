@extends('layouts.app')

@section('content')
<div class="p-8 bg-gray-50 min-h-screen">

    <h1 class="text-3xl font-bold mb-6 text-orange-500 text-center">
        Llista de Categories
    </h1>

    <!-- Search Bar -->
    <div class="mb-6 flex justify-center">
        <input
            type="text"
            id="search-input"
            placeholder="Cerca per tipus..."
            class="w-full max-w-md border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            onkeyup="filterCategories()"
        >
    </div>

    <!-- Add Category Folding Form -->
    <div class="mb-8 text-center">
        <button
            id="toggle-form-btn"
            class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg transition"
        >
            Afegir Categoria
        </button>

        <div id="add-category-form" class="mt-4 hidden max-w-md mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200">
            <form action="{{ route('categorias.store') }}" method="POST" id="new-category-form">
                @csrf
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom Categoria *</label>
                <input
                    type="text"
                    name="tipo"
                    required
                    placeholder="Escriu el tipus"
                    class="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                <div class="flex justify-end">
                    <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition">
                        Afegir
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="categories-grid">
        @forelse($categorias as $categoria)
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition category-card">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                        Categoria
                    </span>

                    <a href="{{ route('categorias.edit', $categoria->id) }}"
                       class="flex items-center gap-1 text-orange-500 hover:text-orange-700 text-sm font-semibold"
                       title="Editar Categoria">
                        <svg class="h-4 w-4">
                            <use href="{{ asset('icons/sprite.svg#icon-edit') }}"></use>
                        </svg>
                        Editar
                    </a>
                </div>

                <h2 class="text-xl font-bold text-gray-800 mb-2">{{ $categoria->tipo }}</h2>

                <div class="flex items-center justify-between text-sm text-gray-400">
                    <span>ID #{{ $categoria->id }}</span>
                    <form action="{{ route('categorias.destroy', $categoria->id) }}" method="POST" onsubmit="return confirm('Segur que vols eliminar?')">
                        @csrf
                        @method('DELETE')
                        <button class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">Eliminar</button>
                    </form>
                </div>
            </div>
        @empty
            <div class="col-span-full text-center text-gray-500">
                No hi ha categories disponibles
            </div>
        @endforelse
    </div>

</div>

<!-- JavaScript -->
<script>
    // Toggle Add Category Form
    document.getElementById('toggle-form-btn').addEventListener('click', function() {
        const form = document.getElementById('add-category-form');
        form.classList.toggle('hidden');
    });

    // Search/filter categories by "tipo"
    function filterCategories() {
        const input = document.getElementById('search-input').value.toLowerCase();
        const cards = document.querySelectorAll('.category-card');

        cards.forEach(card => {
            const tipo = card.querySelector('h2').textContent.toLowerCase();
            card.style.display = tipo.includes(input) ? '' : 'none';
        });
    }
</script>
@endsection