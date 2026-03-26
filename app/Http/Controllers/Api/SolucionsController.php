<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solucion;
use App\Models\SolucionAttachment;
use Illuminate\Http\Request;

class SolucionsController extends Controller
{
    public function index()
    {
        return Solucion::with('attachments')->latest()->get();
    }

    public function show($id)
    {
        return Solucion::with('attachments')->findOrFail($id);
    }

    public function store(Request $request)
{
    $request->validate([
        'descripcio' => 'required|string',
        'correu_electronic' => 'required|email',
        'telefon' => 'required|string',
        'estat' => 'required|string',
        'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // max 5MB
    ]);

    $solucion = Solucion::create($request->only('descripcio','correu_electronic','telefon','estat'));

    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $path = $file->store('solucions', 'public'); // storage/app/public/solucions

            $solucion->attachments()->create([
                'nom' => $file->getClientOriginalName(),
                'path' => $path,
                'tipus_arxiu' => $file->getClientOriginalExtension(),
                'tamany' => $file->getSize(),
            ]);
        }
    }

    return response()->json($solucion->load('attachments'), 201);
}

 public function update(Request $request, $id)
    {
        $sol = Solucion::findOrFail($id);

        $request->validate([
            'estat' => 'required|string'
        ]);

        $sol->estat = $request->estat;
        $sol->save();

        return response()->json($sol);
    }

    public function destroy($id)
    {
        $solucio = Solucion::findOrFail($id);
        $solucio->delete();

        return response()->json(['message' => 'Deleted']);
    }
}