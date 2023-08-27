<?php

namespace App\Models;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Ticket extends Model
{
    use HasUuids;
    public function payment()
    {
        return $this->belongsTo(Payment::class);
        // return $this->hasMany(Payment::class);
    }
}
