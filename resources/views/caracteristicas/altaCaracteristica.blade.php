@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#f5f5f7] p-10">

    <h1 class="text-3xl font-semibold text-gray-900 mb-8">Alta de Característica</h1>

    <div class="bg-white rounded-2xl shadow-sm p-8 max-w-3xl">
        <form action="{{ route('caracteristicas.store') }}" method="POST">
            @csrf

            <!-- Descripcio -->
            <div class="mb-4">
                <label for="descripcio" class="block text-gray-700 font-medium mb-2">Descripció</label>
                <textarea name="descripcio" id="descripcio"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4">{{ old('descripcio') }}</textarea>
                @error('descripcio')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Tipo -->
            <div class="mb-4">
                <label for="id_tipo" class="block text-gray-700 font-medium mb-2">Tipo</label>
                <select name="id_tipo" id="id_tipo"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Selecciona un tipo --</option>
                    @foreach($tipos as $tipo)
                        <option value="{{ $tipo->id }}" {{ old('id_tipo') == $tipo->id ? 'selected' : '' }}>
                            {{ $tipo->descripcion }}
                        </option>
                    @endforeach
                </select>
                @error('id_tipo')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div class="mt-6">
                <button type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Guardar Característica
                </button>
            </div>
        </form>
    </div>

</div>
@endsection