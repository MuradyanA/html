<?php

namespace App\Http\Controllers;

use App\Models\ChatParticipants;
use App\Models\ChatSession;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OnlineChatController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phoneNumber' => ['required', 'regex:/^[+\[0-9]([0-9\-])*$/', 'min:9'],
        ]);
        // dd($validated);
        $participant = ChatParticipants::firstOrCreate(
            ['email' => $validated['email']],
            $validated
        );

        $chatSession = new ChatSession;
        $chatSession->participant_email = $validated['email'];
        $chatSession->consultant_id = null;
        $chatSession->end = null;
        $chatSession->rate = null;
        $chatSession->save();
        $request->session()->put('chatSessionId', $chatSession->id);
    }
}