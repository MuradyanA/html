<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->enum('weekday',[0,1,2,3,4,5,6]);
            $table->time('hour');
            $table->foreignId('movie_id');
            $table->foreignId('hall_id');
            $table->date('starts');
            $table->integer('parter_price');
            $table->integer('amphitheater_price');
            $table->timestamps();
            $table->foreign('movie_id')->references('id')->on('movies');
            $table->foreign('hall_id')->references('id')->on('seances');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('seances');
    }
};
