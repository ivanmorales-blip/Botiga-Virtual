@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#f5f5f7] p-10">

    <h1 class="text-3xl font-semibold text-gray-900 mb-8">Editar Producto</h1>

    <div class="bg-white rounded-2xl shadow-sm p-8 max-w-3xl">
        <form action="{{ route('productos.update', $product->id) }}" method="POST">
            @csrf
            @method('PUT')

            <!-- Nombre del producto -->
            <div class="mb-4">
                <label for="nombre" class="block text-gray-700 font-medium mb-2">Nombre del Producto</label>
                <input type="text" name="nombre" id="nombre" value="{{ old('nombre', $product->nombre) }}"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @error('nombre')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Descripción -->
            <div class="mb-4">
                <label for="descripcion" class="block text-gray-700 font-medium mb-2">Descripción</label>
                <textarea name="descripcion" id="descripcion"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4">{{ old('descripcion', $product->descripcion) }}</textarea>
                @error('descripcion')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Precio -->
            <div class="mb-4">
                <label for="precio" class="block text-gray-700 font-medium mb-2">Precio</label>
                <input type="number" name="precio" id="precio" value="{{ old('precio', $product->precio) }}" step="0.01"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @error('precio')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Stock -->
            <div class="mb-4">
                <label for="stock" class="block text-gray-700 font-medium mb-2">Stock</label>
                <input type="number" name="stock" id="stock" value="{{ old('stock', $product->stock) }}"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @error('stock')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Categoría -->
            <div class="mb-4">
                <label for="categoria_id" class="block text-gray-700 font-medium mb-2">Categoría</label>
                <div class="relative">
                    <select name="categoria_id" id="categoria_id"
                        class="w-full border border-gray-300 rounded-lg p-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none">
                        <option value="">-- Selecciona una categoría --</option>
                        @foreach($categorias as $categoria)
                            <option value="{{ $categoria->id }}" {{ old('categoria_id', $product->categoria_id) == $categoria->id ? 'selected' : '' }}>
                                {{ $categoria->tipo }}
                            </option>
                        @endforeach
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                @error('categoria_id')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Botón Guardar -->
            <div class="mt-6 flex space-x-4">
                <button type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Actualizar Producto
                </button>
                <a href="{{ route('productos.index') }}"
                    class="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                    Cancelar
                </a>
            </div>
        </form>
    </div>

</div>
@endsection