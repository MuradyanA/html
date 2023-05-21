<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Attributes\Payment;

class Ticket extends Model
{
    use HasUuids;
    public function payment()
    {
        return $this->hasMany(Payment::class);
    }
}
