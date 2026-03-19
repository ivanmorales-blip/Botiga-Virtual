<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TipoCaracteristica;

class TipoCaracteristicasController extends Controller
{
    // Return JSON list of all tipos
    public function index()
    {
        $tipos = TipoCaracteristica::all();
        return response()->json($tipos);
    }

    // Create a new tipo
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
            'Descripcio' => 'nullable|string',
        ]);

        $tipo = TipoCaracteristica::create([
            'tipo' => $request->tipo,
            'Descripcio' => $request->Descripcio ?? $request->tipo,
        ]);

        return response()->json($tipo, 201);
    }
}