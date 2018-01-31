<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->default(str_random(20));
            $table->integer('role_id')->default(1);
            $table->integer('status')->default(0);
            $table->timestamp('last_login');
            $table->rememberToken();
            $table->timestamps();
        });

        DB::table('users')->insert(
            array(
                'name' => 'Luke Jakimowicz',
                'email' => 'dev@lj.ie',
                'password' => '$2y$10$9anTC9G.cDGZGXFdbnKfaexdeIs9SMN5L5rWZiMn0bjKUYMd.wDLi',
                'role_id' => 666,
                'status' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'last_login' => Carbon::now()->format('Y-m-d H:i:s')
            )
        );
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
