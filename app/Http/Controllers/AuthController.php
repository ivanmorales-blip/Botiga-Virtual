<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login'); // your login blade
    }

    public function login(Request $request)
    {
        $user = Usuario::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->contraseña)) {
            Auth::login($user);

            if ($user->admin) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'email' => 'Credenciales incorrectas',
        ]);
    }
}