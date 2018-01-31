<?php

namespace App;

use Hash;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Config;
use App\Notifications\MailResetPasswordToken;
use App\Notifications\MailNewPasswordToken;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'role_id', 'status'
    ];

    /**
     * Automatically creates hash for the user password.
     *
     * @param  string  $value
     * @return void
     */
    public function setPasswordAttribute($value) {
        $this->attributes['password'] = Hash::make($value);
    }

    public function getJWTCustomClaims() {
        $admin_role_id = intval(Config::get('auth.admin_role_id'), 10);
        if ($this->role_id === $admin_role_id) return ['admin' => 1];
        return ['admin' => 0];
    }

    public function sendPasswordResetNotification($token) {
        if ($this->status === 1) {
            $this->notify(new MailResetPasswordToken($token));
        } else if ($this->status === 0) {
            $this->notify(new MailNewPasswordToken($token));
        }
    }
}
