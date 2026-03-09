<?php

namespace App\Http\Controllers;

use App\Models\Caracteristica;
use Illuminate\Http\Request;

class CaracteristicaController extends Controller
{
    /**
     * Mostrar la lista de características
     */
    public function index()
    {
        // Traemos todas las características (puedes paginar si quieres)
        $caracteristicas = Caracteristica::all();

        // Retornamos la vista index.blade.php dentro de resources/views/caracteristicas
        return view('caracteristicas.index', compact('caracteristicas'));
    }

    /**
     * Mostrar el formulario para crear una nueva característica
     */
    public function create()
    {
        // Retornamos la vista create.blade.php dentro de resources/views/caracteristicas
        return view('caracteristicas.create');
    }

    /**
     * Guardar una nueva característica en la base de datos
     */
    public function store(Request $request)
    {
        // Validar datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        // Crear la nueva característica
        Caracteristica::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        // Redirigir a la lista con un mensaje de éxito
        return redirect()->route('caracteristicas.index')
            ->with('success', 'Característica creada correctamente.');
    }
}