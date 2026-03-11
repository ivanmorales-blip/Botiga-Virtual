<?php

namespace App\Http\Controllers;

use App\Models\Caracteristica;
use App\Models\TipoCaracteristica;
use Illuminate\Http\Request;

class CaracteristicaController extends Controller
{
    public function index()
    {
        $caracteristicas = Caracteristica::with('tipo')->get();
        return view('caracteristicas.listaCaracteristica', compact('caracteristicas'));
    }

    public function create()
    {
        $tipos = TipoCaracteristica::all();
        return view('caracteristicas.altaCaracteristica', compact('tipos'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'descripcio' => 'required|string',
            'tipo_id' => 'nullable|exists:tipo_caracteristica,id',
        ]);

        Caracteristica::create([
            'descripcio' => $request->descripcio,
            'tipo_id' => $request->tipo_id,
        ]);

        return redirect()->route('caracteristicas.index')
            ->with('success', 'Característica creada correctamente.');
    }

    public function destroy($id)
    {
        $caracteristica = Caracteristica::findOrFail($id);
        $caracteristica->delete();

        return redirect()->route('caracteristicas.index')
            ->with('success', 'Característica eliminada correctamente.');
    }
}