<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        if ($request->email) {
            $user = User::where('email', $request->email)->first();
        }

        if (!$user) {
            return response('User not found', 404);
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response('The provided credentials are incorrect.', 401);
        }

        $success['token'] = $user->createToken('LaravelSanctumAuth')->plainTextToken;

        $success['name'] = $user->name;

        $success['success'] = 'User logged in successfully';

        return response($success, 200);
    }
}
