@extends('layouts.app')

@section('content')

<div class="min-h-screen p-8 bg-gray-100">

    <div class="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-gray-200">

        <!-- HEADER -->
        <h1 class="text-4xl font-bold text-gray-800 mb-10 text-center tracking-tight">
            {{ isset($pack) ? 'Editar Pack' : 'Crear nou Pack' }}
        </h1>

        <form id="pack-form"
              action="{{ isset($pack) ? route('packs.update', $pack->id) : route('packs.store') }}"
              method="POST">
            @csrf
            @if(isset($pack))
                @method('PUT')
            @endif

            <!-- PACK DATA -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom del Pack *</label>
                    <input type="text" name="nom" required
                           value="{{ old('nom', $pack->nom ?? '') }}"
                           class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Preu *</label>
                    <input type="number" name="preu" required
                           value="{{ old('preu', $pack->preu ?? '') }}"
                           class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripció *</label>
                    <textarea name="Descripcio" rows="2" required
                              class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">{{ old('Descripcio', $pack->Descripcio ?? '') }}</textarea>
                </div>
            </div>

            <!-- DRAG & DROP PRODUCTS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 h-[520px]">

                <!-- AVAILABLE PRODUCTS -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-700 mb-3 flex justify-between items-center">
                        Productes disponibles
                        <span id="available-count" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {{ $products->count() }}
                        </span>
                    </h2>

                    <ul id="available-products"
                        class="bg-gray-100 p-2 rounded-2xl min-h-[350px] space-y-3 shadow-inner overflow-y-auto"
                        ondragover="allowDrop(event)">
                        @foreach($products as $product)
                        <li draggable="true" ondragstart="drag(event)" data-id="{{ $product->id }}"
                            class="available-product p-4 bg-white rounded-xl shadow border border-gray-200 cursor-move flex justify-between items-center hover:bg-gray-50">
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">{{ $product->nombre }}</span>
                                <span class="text-sm text-gray-500">{{ $product->categoria->nombre ?? 'Sense categoria' }}</span>
                                <span class="text-sm text-gray-600 font-medium">{{ $product->precio }} €</span>
                            </div>
                            <div class="text-gray-300 text-xl select-none">☰</div>
                        </li>
                        @endforeach
                    </ul>
                </div>

                <!-- PACK PRODUCTS -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-700 mb-3 flex justify-between items-center">
                        Productes del Pack
                        <span id="assigned-count" class="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {{ isset($pack) ? $pack->productes->count() : 0 }}
                        </span>
                    </h2>

                    <ul id="pack-products"
                        class="bg-gray-100 p-2 rounded-2xl min-h-[350px] space-y-3 shadow-inner overflow-y-auto"
                        ondragover="allowDrop(event)"
                        ondrop="drop(event,'assigned')">

                        @if(isset($pack))
                            @foreach($pack->productes as $product)
                                <li data-id="{{ $product->id }}"
                                    class="p-4 bg-white rounded-xl shadow border border-gray-200 flex justify-between items-center">
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-gray-800">{{ $product->nombre }}</span>
                                        <span class="text-sm text-gray-500">{{ $product->categoria->nombre ?? 'Sense categoria' }}</span>
                                        <span class="text-sm text-gray-600 font-medium">{{ $product->precio }} €</span>
                                    </div>
                                    <div class="text-gray-300 text-xl select-none">☰</div>
                                    <button type="button"
                                            class="text-red-500 font-bold ml-4"
                                            onclick="this.parentElement.remove(); updateCount();">
                                        ✕
                                    </button>
                                </li>
                            @endforeach
                        @endif

                    </ul>
                </div>
            </div>

            <!-- Hidden inputs container for selected products -->
            <div id="productes-input-container"></div>

            <!-- BUTTONS -->
            <div class="mt-10 flex justify-end gap-4">
                <a href="{{ route('packs.index') }}" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800">
                    Cancel·lar
                </a>

                <button type="button" id="save-btn" class="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl shadow">
                    {{ isset($pack) ? 'Actualitzar Pack' : 'Guardar Pack' }}
                </button>
            </div>

        </form>
    </div>
</div>

<script>
let draggedElement = null;

function drag(event) {
    draggedElement = event.target.closest('li');
    event.dataTransfer.setData('text/plain', draggedElement.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, target) {
    event.preventDefault();
    if (target !== 'assigned' || !draggedElement) return;

    const packList = document.getElementById('pack-products');

    // Clone dragged element
    const clone = draggedElement.cloneNode(true);
    clone.classList.remove('available-product');
    clone.removeAttribute('draggable');

    // Remove any old delete buttons
    clone.querySelectorAll('button').forEach(btn => btn.remove());

    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕';
    deleteBtn.className = 'text-red-500 font-bold ml-4';
    deleteBtn.onclick = () => {
        clone.remove();
        updateCount();
    };
    clone.appendChild(deleteBtn);

    packList.appendChild(clone);
    updateCount();
}

function updateCount() {
    const count = document.querySelectorAll('#pack-products li').length;
    document.getElementById('assigned-count').innerText = count;
}

function saveForm() {
    const assigned = document.querySelectorAll('#pack-products li');
    const container = document.getElementById('productes-input-container');
    container.innerHTML = ''; // clear old inputs

    assigned.forEach(el => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'productes[]';
        input.value = el.dataset.id;
        container.appendChild(input);
    });

    document.getElementById('pack-form').submit();
}

document.getElementById('save-btn').addEventListener('click', saveForm);
</script>

@endsection