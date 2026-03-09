<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PackController extends Controller
{
    private $apiUrl = "http://localhost:8000/api"; // change if needed

    /**
     * Display a listing of packs
     */
    public function index()
    {
        $response = Http::get($this->apiUrl . "/packs");

        $packs = $response->json();

        return view("pack.listar", ["packs" => $packs]);
    }

    /**
     * Show form to create pack
     */
    public function create()
    {
        $response = Http::get($this->apiUrl . "/productes");

        $productes = $response->json();

        return view("pack.alta", ['productes' => $productes]);
    }

    /**
     * Store a newly created pack
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'Descripcio' => 'required|string',
            'preu' => 'required|integer',
        ]);

        $data = [
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu,
            'productes' => $request->productes
        ];

        Http::post($this->apiUrl . "/packs", $data);

        return redirect()->route('menu');
    }

    /**
     * Show specific pack
     */
    public function show($id)
    {
        $response = Http::get($this->apiUrl . "/packs/" . $id);

        $pack = $response->json();

        return view('pack.show', compact('pack'));
    }

    /**
     * Edit pack
     */
    public function edit($id)
    {
        $packResponse = Http::get($this->apiUrl . "/packs/" . $id);
        $productsResponse = Http::get($this->apiUrl . "/productes");

        $pack = $packResponse->json();
        $products = $productsResponse->json();

        return view('pack.editar', compact('pack','products'));
    }

    /**
     * Update pack
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'Descripcio' => 'sometimes|string',
            'preu' => 'sometimes|integer'
        ]);

        $data = $request->only(['nom','Descripcio','preu','productes']);

        Http::put($this->apiUrl . "/packs/" . $id, $data);

        return redirect()->route('packs.listar');
    }

    /**
     * Delete pack
     */
    public function destroy($id)
    {
        Http::delete($this->apiUrl . "/packs/" . $id);

        return response()->json([
            'message' => 'Pack deleted successfully'
        ]);
    }
}