<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PackController;

Route::get('/ping', function (Request $request) {
    return response()->json([
        'message' => 'pong del laravel'
    ]);

});

Route::apiResource('packs', PackController::class);

?>