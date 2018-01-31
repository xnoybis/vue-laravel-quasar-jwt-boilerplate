<?php

namespace App\Api\V1\Controllers;

use App\Http\Controllers\Controller;
use App\User;

class AccountsController extends Controller
{
    public function getAccounts() {

        $users = User::all();
        return $users->makeVisible('status')->toArray();

    }
}
