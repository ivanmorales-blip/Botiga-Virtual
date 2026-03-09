<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pack;
use App\Models\Producte;

class PackController extends Controller
{
    /**
     * Display a listing of packs
     */
    public function index()
    {
        $packs = Pack::with('productes')->get();
        return view(
            "pack.listar", ["packs" =>$packs]
        );
    }

    public function create()
    {
        $productes = Producte::get();
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

        $pack = Pack::create([
            'nom' => $request->nom,
            'Descripcio' => $request->Descripcio,
            'preu' => $request->preu
        ]);

        // Save pack products
        if ($request->productes) {

            $productes = json_decode($request->productes);

            foreach ($productes as $productId) {

                DB::table('productos_pack')->insert([
                    'packs_id' => $pack->id,
                    'producte_id' => $productId,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            }
        }

        return redirect()->route('menu');
    }

    /**
     * Display the specified pack
     */
    public function show(Pack $pack)
    {
        return view('pack.show', compact('pack'));
    }

    public function edit($id)
    {
        $pack = Pack::findOrFail($id);

        $products = Producto::with('categoria')->get();

        $packProducts = DB::table('productos_pack')
            ->join('productos','productos_pack.producte_id','=','productos.id')
            ->where('packs_id',$id)
            ->select('productos.*')
            ->get();

        return view('pack.editar',compact('pack','products','packProducts'));
    }

    /**
     * Update the specified pack
     */
    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'Descripcio' => 'sometimes|string',
            'preu' => 'sometimes|integer'
        ]);

        $pack->update($request->only(['nom','Descripcio','preu']));

        // Remove old products
        DB::table('productos_pack')
            ->where('packs_id',$pack->id)
            ->delete();

        // Insert new ones
        if($request->productes){

            $products=json_decode($request->productes);

            foreach($products as $productId){

                DB::table('productos_pack')->insert([
                    'packs_id'=>$pack->id,
                    'producte_id'=>$productId,
                    'created_at'=>now(),
                    'updated_at'=>now()
                ]);

            }
        }

        return redirect()->route('packs.listar');
    }

    /**
     * Remove the specified pack
     */
    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();

        return response()->json([
            'message' => 'Pack deleted successfully'
        ]);
    }
}