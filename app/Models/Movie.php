<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;
    protected $db = [
        'movieName',
        'genre',
        'description',
        'realiseDate',
        'poster'
    ];
}
