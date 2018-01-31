<?php

namespace App\Api\V1\Controllers;

use Config;
use App\User;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Controller;
use App\Api\V1\Requests\SignUpRequest;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Database\QueryException;

class SignUpController extends Controller
{
    public function signUp(SignUpRequest $request)
    {
        $user = new User($request->all());
        try {
            $user->save();
        } catch (QueryException $e) {
            throw new HttpException(500, "There was a problem with creation of this account.");
        }

        $broker = Password::broker();
        $sendingResponse = $broker->sendResetLink($request->only('email'));

        if($sendingResponse !== Password::RESET_LINK_SENT) {
            throw new HttpException(500, "There was a problem sending a reset link to you, please try again.");
        }

        return response()->json([
            'status' => 'ok'
        ], 201);

    }
}
