<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id');
            $table->foreignId('movie_id');
            $table->time('seance_time');
            $table->date('seance_date');
            $table->foreignId('payment_id');
            $table->boolean('is_used')->default(false);
            $table->foreignId('hall_id');
            $table->integer('seat');
            $table->decimal('ticket_price', $precision = 8, $scale = 2);
            $table->string('seat_type');
            $table->timestamps();
            $table->foreign('payment_id')->references('id')->on('payments');
            $table->foreign('movie_id')->references('id')->on('movies');
            $table->foreign('hall_id')->references('id')->on('seances');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('tickets');
    }
};