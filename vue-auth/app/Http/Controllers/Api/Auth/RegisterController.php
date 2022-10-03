<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'name' => 'required',
        //     'email' => 'required|email',
        //     'password' => 'required',
        // ]);

        // if ($validator->fails()) {
        //     return response('Need more information', 429);
        // }

        $user = User::create($request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]));

        $success['name'] = $user->name;
        $success['success'] = 'User registered successfully';

        return response($success, 200);
    }
}
