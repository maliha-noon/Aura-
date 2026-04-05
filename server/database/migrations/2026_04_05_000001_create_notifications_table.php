<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');
            $blueprint->string('title');
            $blueprint->text('message');
            $blueprint->string('type')->default('info');
            $blueprint->boolean('is_read')->default(false);
            $blueprint->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
