<?php

namespace App\Http\Controllers;

use App\Models\ChatMessages;
use Illuminate\Http\Request;
use App\Enums\MessageTypes;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required',
        ]);

        if($request->session()->has('chatSessionId')){
            $newMessage = new ChatMessages;
            $newMessage->message = $validated['message'];
            $newMessage->chat_session_id = $request->session()->get('chatSessionId');
            $newMessage->messageType = MessageTypes::participant->value;
            $newMessage->save();
        }
        return response('', 200);
    }
}
