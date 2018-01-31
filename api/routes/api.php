<?php

use Dingo\Api\Routing\Router;

/** @var Router $api */
$api = app(Router::class);

$api->version('v1', function (Router $api) {
    $api->group(['prefix' => 'auth'], function(Router $api) {
        $api->post('login', 'App\\Api\\V1\\Controllers\\LoginController@login');
        $api->post('forgot', 'App\\Api\\V1\\Controllers\\ForgotPasswordController@sendResetEmail');
        $api->post('reset', 'App\\Api\\V1\\Controllers\\ResetPasswordController@resetPassword');
    });

    $api->group(['prefix' => 'auth', 'middleware' => 'jwt.refresh'], function(Router $api) {
         $api->post('refresh', 'App\\Api\\V1\\Controllers\\LoginController@refreshToken');
    });

    $api->group(['middleware' => 'jwt.auth', 'middleware' => 'jwt.admin'], function(Router $api) {
        $api->get('admin/accounts', 'App\\Api\\V1\\Controllers\\AccountsController@getAccounts');
        $api->post('admin/create', 'App\\Api\\V1\\Controllers\\SignUpController@signUp');
    });
});
