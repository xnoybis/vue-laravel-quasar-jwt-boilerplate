<?php

namespace App\Api\V1\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use App\Api\V1\Requests\LoginRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use Carbon\Carbon;
use Config;

class LoginController extends Controller
{
    public function login(LoginRequest $request, JWTAuth $JWTAuth)
    {
        $credentials = $request->only(['email', 'password']);

        try {
            $user = User::where('email', $request->get('email'))->first();

            if (!empty($user)) {
                if ($user->status !== Config::get('auth.status_suspended')) {

                    $claims = $user->getJWTCustomClaims();
                    $token = $JWTAuth->attempt($credentials, $claims);

                    if(!$token) {
                        throw new HttpException(403, "Wrong username or password.");
                    }
                } else {
                    throw new HttpException(401, "Your account is suspended, please contact an administrator.");
                }
            } else {
                throw new HttpException(403, "Wrong username or password.");
            }

        } catch (JWTException $e) {
            throw new HttpException(500, "There was a problem signing you in, please try again.");
        }

        $user->last_login = new Carbon();
        $user->save();

        return response()
            ->json([
                'status' => 'ok',
                'token' => $token
        ]);
    }

    public function refreshToken() {

        return response()
            ->json([
                'status' => 'ok'
        ]);

    }
}
