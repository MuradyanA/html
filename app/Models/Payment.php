<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Attributes\Ticket;

class Payment extends Model
{
    use HasFactory;
    public function ticket()
    {
        return $this->hasMany(Ticket::class);
    }
}
