<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex h-screen bg-gray-100 font-sans">

    <aside class="w-64 bg-white shadow-md">
        <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
            <nav class="flex flex-col space-y-2">
            
            <a href="{{ route('admin.dashboard') }}" class="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>

            <!-- Productos desplegable -->
            <div x-data="{ open: false }" class="relative">
                <button @click="open = !open" class="w-full text-left text-gray-700 hover:text-blue-600 font-medium flex justify-between items-center">
                    Productos
                    <svg class="w-4 h-4 transform" :class="{'rotate-90': open}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div x-show="open" class="ml-4 mt-2 flex flex-col space-y-1">
                    <a href="{{ route('productos.create') }}" class="text-gray-600 hover:text-blue-500 text-sm">Alta Producto</a>
                    <a href="{{ route('productos.index') }}" class="text-gray-600 hover:text-blue-500 text-sm">Listar Productos</a>
                </div>
            </div>

            <!-- Categorías desplegable -->
            <div x-data="{ open: false }" class="relative mt-2">
                <button @click="open = !open" class="w-full text-left text-gray-700 hover:text-blue-600 font-medium flex justify-between items-center">
                    Categorías
                    <svg class="w-4 h-4 transform" :class="{'rotate-90': open}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div x-show="open" class="ml-4 mt-2 flex flex-col space-y-1">
                    <a href="{{ route('categorias.create') }}" class="text-gray-600 hover:text-blue-500 text-sm">Alta Categoría</a>
                    <a href="{{ route('categorias.index') }}" class="text-gray-600 hover:text-blue-500 text-sm">Listar Categorías</a>
                </div>
            </div>

            <div x-data="{ open: false }" class="relative mt-2">
                <button @click="open = !open" class="w-full text-left text-gray-700 hover:text-blue-600 font-medium flex justify-between items-center">
                    Características
                    <svg class="w-4 h-4 transform" :class="{'rotate-90': open}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div x-show="open" class="ml-4 mt-2 flex flex-col space-y-1">
                    <a href="{{ route('caracteristicas.create') }}" class="text-gray-600 hover:text-blue-500 text-sm">Alta Característica</a>
                    <a href="{{ route('caracteristicas.index') }}" class="text-gray-600 hover:text-blue-500 text-sm">Listar Características</a>
                </div>
            </div>

            <div x-data="{ open: false }" class="relative mt-2">
                <button @click="open = !open" class="w-full text-left text-gray-700 hover:text-blue-600 font-medium flex justify-between items-center">
                    Packs
                    <svg class="w-4 h-4 transform" :class="{'rotate-90': open}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div x-show="open" class="ml-4 mt-2 flex flex-col space-y-1">
                    <a href="{{ route('packs.create') }}" class="text-gray-600 hover:text-blue-500 text-sm">Alta Pack</a>
                    <a href="{{ route('packs.index') }}" class="text-gray-600 hover:text-blue-500 text-sm">Listar Packs</a>
                </div>
            </div>

        </nav>
    </div>
</aside>

<script src="//unpkg.com/alpinejs" defer></script>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-y-auto">

        <!-- Header -->
        <header class="bg-white shadow-sm p-6 flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div>
                <!-- Aquí podrías poner logout o perfil -->
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Logout</button>
            </div>
        </header>

        <!-- Content -->
        <main class="p-10">
            @yield('content')
        </main>

    </div>

</body>
</html>