<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Configuracio;
use Illuminate\Http\Request;

class ConfiguracioController extends Controller {
    public function index() {
        return Configuracio::all();
    }

    public function update(Request $request, $clau) {
        $config = Configuracio::where('clau', $clau)->firstOrFail();
        $config->update(['valor' => $request->valor]);
        return response()->json($config);
    }
}