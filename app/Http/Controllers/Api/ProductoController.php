<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\ProductoImatge;


class ProductoController extends Controller
{
public function index(Request $request)
{
   $query = Producto::with('caracteristicas', 'categoria', 'imatges');


   // Category filter
   if ($request->filled('categoria')) {
       $query->where('categoria_id', $request->categoria);
   }


   // Characteristic filter (FIXED)
   if ($request->filled('caracteristica')) {


       $caracteristicas = $request->input('caracteristica');


       // always normalize to array
       if (!is_array($caracteristicas)) {
           $caracteristicas = [$caracteristicas];
       }


       $query->whereHas('caracteristicas', function ($q) use ($caracteristicas) {
           $q->whereIn('caracteristicas.id', $caracteristicas);
       });
   }


   $productos = $query->get();


   return response()->json($productos);
}


   // New function to fetch all products with categories & characteristics
   public function indexWithRelations()
   {
       $productos = Producto::with('categoria', 'caracteristicas', 'imatges')
           ->where('estat', true)
           ->get();


       return response()->json($productos, 200);
   }


   public function showWithRelations($id)
   {
       $producto = Producto::with('categoria', 'caracteristicas', 'imatges')
           ->findOrFail($id);


       return response()->json($producto, 200);
   }


   public function recent()
   {
       $products = Producto::with('categoria', 'imatges')
           ->where('estat', true)
           ->where('created_at', '>=', now()->subDays(30))
           ->orderBy('created_at', 'desc')
           ->take(5)
           ->get();


       return response()->json($products, 200);
   }


   public function store(Request $request)
   {
       $request->validate([
           'nombre' => 'required|string|max:255',
           'precio' => 'required|numeric',
           'stock' => 'required|integer|min:0',
           'imagen' => 'nullable|image|mimes:jpg,png,jpeg,webp|max:2048',
           'imagenes.*' => 'nullable|image|mimes:jpg,png,jpeg,webp|max:2048',
       ]);


       $producto = Producto::create([
           'nombre' => $request->nombre,
           'codi' => $request->codi,
           'precio' => $request->precio,
           'stock' => $request->stock,
           'descripcion' => $request->descripcion,
           'categoria_id' => $request->categoria_id,
           'marca' => $request->marca,
           'estat' => true,
           'destacat' => $request->destacat ?? false,
       ]);


       if ($request->has('caracteristicas')) {
           $producto->caracteristicas()->sync($request->caracteristicas);
       }


       // Primera imagen
       if ($request->hasFile('imagen')) {
           $path = $request->file('imagen')->store('productos', 'public');
           ProductoImatge::create([
               'nom' => $request->file('imagen')->getClientOriginalName(),
               'path' => $path,
               'producto_id' => $producto->id
           ]);
       }


       // Imágenes adicionales (2ª y 3ª)
       if ($request->hasFile('imagenes')) {
           foreach ($request->file('imagenes') as $img) {
               $path = $img->store('productos', 'public');
               ProductoImatge::create([
                   'nom' => $img->getClientOriginalName(),
                   'path' => $path,
                   'producto_id' => $producto->id
               ]);
           }
       }


       return response()->json([
           'message' => 'Producto creado correctamente',
           'producto' => $producto
       ], 201);
   }


   public function show($id)
   {
       $producto = Producto::with([
           'categoria',
           'caracteristicas',
           'imatges'
       ])->findOrFail($id);


       return response()->json($producto, 200);
   }


       public function update(Request $request, $id)
{
    $producto = Producto::findOrFail($id);

    $producto->update([
        'nombre' => $request->nombre,
        'codi' => $request->codi,
        'precio' => $request->precio,
        'stock' => $request->stock,
        'descripcion' => $request->descripcion,
        'categoria_id' => $request->categoria_id,
        'marca' => $request->marca,
        'destacat' => $request->destacat ?? false
    ]);

    if ($request->has('caracteristicas')) {
        $producto->caracteristicas()->sync($request->caracteristicas);
    }

    if ($request->has('imatges_a_borrar')) {
        foreach ($request->imatges_a_borrar as $imatgeId) {
            $imatge = ProductoImatge::find($imatgeId);
            if ($imatge) {
                \Storage::disk('public')->delete($imatge->path);
                $imatge->delete();
            }
        }
    }

    if ($request->hasFile('imagen')) {
        $path = $request->file('imagen')->store('productos', 'public');

        ProductoImatge::create([
            'nom' => $request->file('imagen')->getClientOriginalName(),
            'path' => $path,
            'producto_id' => $producto->id
        ]);
    }

    if ($request->hasFile('imagenes')) {
        foreach ($request->file('imagenes') as $img) {
            $path = $img->store('productos', 'public');

            ProductoImatge::create([
                'nom' => $img->getClientOriginalName(),
                'path' => $path,
                'producto_id' => $producto->id
            ]);
        }
    }

    return response()->json([
        'message' => 'Producte actualitzat correctament'
    ]);
}


   public function deactivate($id)
   {
       $producto = Producto::findOrFail($id);
       $producto->update(['estat' => false]);


       return response()->json($producto, 200);
   }


   public function activate($id)
   {
       $producto = Producto::findOrFail($id);
       $producto->update(['estat' => true]);


       return response()->json($producto, 200);
   }


   public function destroy($id)
   {
       $producto = Producto::findOrFail($id);


       if ($producto->estat) {
           return response()->json([
               'message' => 'Cannot delete active product. Deactivate first.'
           ], 403);
       }


       $producto->delete();


       return response()->json(['message' => 'Producto deleted successfully'], 200);
   }


   public function productosPorCategoriaYCaracteristica($categoriaId, $caracteristicaId)
   {
       $productos = Producto::with(['categoria', 'caracteristicas', 'imatges'])
           ->where('categoria_id', $categoriaId)
           ->whereHas('caracteristicas', function ($query) use ($caracteristicaId) {
               $query->where('caracteristicas.id', $caracteristicaId);
           })
           ->where('estat', true)
           ->get();


       return response()->json($productos, 200);
   }
}
