<?php

namespace App\Models;

use App\Models\ChatParticipants;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;
    public function chatParticipant()
    {
        return $this->belongsTo(ChatParticipants::class);
    }

    public function messages(){
        return $this->hasMany(ChatMessages::class);
    }
}
