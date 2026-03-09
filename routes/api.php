<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function (Request $request) {
    return response()->json([
        'message' => 'pong del laravel'
    ]);

});


use App\Http\Controllers\Api\PackController as PackApiController;

Route::apiResource('packs', PackApiController::class);

?>