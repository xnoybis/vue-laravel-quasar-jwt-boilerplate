<?php

namespace App\Api\V1\Controllers;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use App\Api\V1\Requests\ForgotPasswordRequest;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Config;

class ForgotPasswordController extends Controller
{
    public function sendResetEmail(ForgotPasswordRequest $request)
    {
        $user = User::where('email', '=', $request->get('email'))->first();

        if(!$user) {
            throw new HttpException(404, "No account with that e-mail address.");
        }

        if ($user->status !== Config::get('auth.status_suspended')) {

            $broker = $this->getPasswordBroker();
            $sendingResponse = $broker->sendResetLink($request->only('email'));

            if($sendingResponse !== Password::RESET_LINK_SENT) {
                throw new HttpException(500, "There was a problem sending a reset link to you, please try again.");
            }

            return response()->json([
                'status' => 'ok'
            ], 200);

        } else {
            throw new HttpException(403, "Your account is suspended, please contact an administrator.");
        }
    }

    /**
     * Get the broker to be used during password reset.
     *
     * @return \Illuminate\Contracts\Auth\PasswordBroker
     */
    private function getPasswordBroker()
    {
        return Password::broker();
    }
}
