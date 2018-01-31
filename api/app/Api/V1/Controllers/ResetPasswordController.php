<?php

namespace App\Api\V1\Controllers;

use Config;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use App\Api\V1\Requests\ResetPasswordRequest;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ResetPasswordController extends Controller
{
    public function resetPassword(ResetPasswordRequest $request) {
        
        $user = User::where('email', '=', $request->get('email'))->first();

        if (!empty($user)) {
        
            if ($user->status !== Config::get('auth.status_suspended')) {

                $response = $this->broker()->reset(
                    $this->credentials($request), function ($user, $password) {
                        $this->reset($user, $password);
                    }
                );

                if ($response !== Password::PASSWORD_RESET) {

                    if ($response === Password::INVALID_PASSWORD) {
                        throw new HttpException(500, "Invalid password, make sure it is at least 6 characters long.");
                    }
                    if ($response === Password::INVALID_TOKEN) {
                        throw new HttpException(403, "There was a problem with your password reset link, please request a new link.");
                    }
                    throw new HttpException(500, "There was a problem setting your password, please try again.");
                }

                $user->status = 1;
                $user->save();
                
                return response()->json([
                    'status' => 'ok',
                ]);

            } else {
                throw new HttpException(403, "Your account is suspended, please contact an administrator.");
            }
        } else {
            throw new HttpException(404, "No account with that e-mail address.");
        }
    }

    /**
     * Get the broker to be used during password reset.
     *
     * @return \Illuminate\Contracts\Auth\PasswordBroker
     */
    public function broker()
    {
        return Password::broker();
    }

    /**
     * Get the password reset credentials from the request.
     *
     * @param  ResetPasswordRequest  $request
     * @return array
     */
    protected function credentials(ResetPasswordRequest $request)
    {
        return $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $password
     * @return void
     */
    protected function reset($user, $password)
    {
        $user->password = $password;
        $user->save();
    }
}
