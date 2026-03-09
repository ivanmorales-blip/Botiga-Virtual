<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CategoriaController extends Controller
{
    private $apiUrl = "http://localhost:8000/api"; // change if needed

    public function index()
    {
        $response = Http::get($this->apiUrl . "/categorias");

        $categoria = $response->json();

        return view("categorias.listar", ["categorias" => $categoria]);
    }

    public function create()
    {
        return view("categorias.alta");
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255'
        ]);

        $data = [
            'tipo' => $request->tipo
        ];

        Http::post($this->apiUrl . "/categorias", $data);

        return redirect()->route('menu');
    }

    public function show($id)
    {
        $response = Http::get($this->apiUrl . "/categorias/" . $id);

        $categoria = $response->json();

        return view('categorias.show', compact('categoria'));
    }

    public function edit($id)
    {
        $Response = Http::get($this->apiUrl . "/categorias/" . $id);

        $categoria = $Response->json();

        return view('categorias.editar', compact('categoria'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'tipo' => 'sometimes|string|max:255'
        ]);

        $data = $request->only(['tipo']);

        Http::put($this->apiUrl . "/categorias/" . $id, $data);

        return redirect()->route('categoria.listar');
    }

    /**
     * Delete pack
     */
    public function destroy($id)
    {
        Http::delete($this->apiUrl . "/categorias/" . $id);

        return response()->json([
            'message' => 'Categoria deleted successfully'
        ]);
    }
}
