<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Caracteristica;
use Illuminate\Http\Request;

class CaracteristicaController extends Controller
{
    public function index()
    {
        $caracteristicas = Caracteristica::with('tipo')->get();
        return response()->json($caracteristicas, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'descripcio' => 'required|string',
            'tipo_id' => 'nullable|exists:tipo_caracteristicas,id',
        ]);

        $caracteristica = Caracteristica::create([
            'descripcio' => $request->descripcio,
            'tipo_id' => $request->tipo_id,
        ]);

        return response()->json($caracteristica, 201);
    }

    public function update(Request $request, $id)
    {
        $caracteristica = Caracteristica::findOrFail($id);

        $request->validate([
            'descripcio' => 'required|string',
            'tipo_id' => 'nullable|exists:tipo_caracteristicas,id',
        ]);

        $caracteristica->update([
            'descripcio' => $request->descripcio,
            'tipo_id' => $request->tipo_id,
        ]);

        return response()->json($caracteristica);
    }

    public function destroy($id)
    {
        $caracteristica = Caracteristica::findOrFail($id);
        $caracteristica->delete();
        return response()->json(['message' => 'Característica eliminada']);
    }
}