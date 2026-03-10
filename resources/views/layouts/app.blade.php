<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERRELLERIA SOLIDÀRIA</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex h-screen bg-gradient-to-r from-orange-50 to-red-50 font-sans">

    <!-- Sidebar -->
    <aside class="w-64 bg-orange-100 shadow-sm p-6 flex justify-between">
        <div class="p-6">
            <img src="/images/logoserralleria.png" alt="Logo" class="mb-6 w-32">
            <nav class="flex flex-col space-y-2">
                <a href="{{ route('admin.dashboard') }}" class="text-white hover:text-orange-200 font-medium"></a>

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
                        <a href="{{ route('categorias.index') }}" class="text-orange-200 hover:text-white text-sm">Listar Categorías</a>
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

            </nav>
        </div>
    </aside>

    <script src="//unpkg.com/alpinejs" defer></script>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-y-auto">

        <!-- Header -->
        <header class="bg-orange-100 shadow-sm p-6 flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-orange-900">SERRELLERIA SOLIDÀRIA</h1>
            
        </header>

        <!-- Content -->
        <main class="p-10">
            @yield('content')
        </main>

    </div>

</body>
</html>