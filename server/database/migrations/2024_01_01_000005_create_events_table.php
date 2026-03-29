<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->dateTime('date');
            $table->string('location');
            $table->longText('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('capacity');
            $table->string('category')->default('General');
            $table->boolean('is_featured')->default(false);
            $table->string('chief_guest')->nullable();
            $table->integer('tickets_sold')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
