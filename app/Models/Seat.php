<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\Sequence;

class Seat extends Model
{
    use HasFactory;
    static function generateSeats(int $numberOfSeats, int $hallId, string $seatType, int $startSeatNum=0)
    {
        self::factory()
            ->count($numberOfSeats)
            ->sequence(fn(Sequence $sequence) => ['seat' => $sequence->index+$startSeatNum])
            ->create(['seatType' => $seatType, 'hall_id' => $hallId]);
    }
    protected $fillable = [
        'student_id',
        'comment',
    ];

    public function hall()
    {
        // return $this->belongsTo('Model', 'foreign_key', 'owner_key'); 
        return $this->belongsTo('App\Models\Hall','hall_id','id');
    }
}