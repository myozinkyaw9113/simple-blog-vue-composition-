<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        $accessToken = $request->bearerToken();

        $token = PersonalAccessToken::findToken($accessToken);

        $token->delete();

        return 'User Logout Successfully';
    }
}
