<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex h-screen bg-gray-100 font-sans">

    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
        <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
            <nav class="flex flex-col space-y-2">
                <a href="{{ route('admin.dashboard') }}" class="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
                <!-- Agrega aquí más links si necesitas -->
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Products</a>
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Categories</a>
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Packs</a>
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Features</a>
            </nav>
        </div>
    </aside>

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