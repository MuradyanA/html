<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use Carbon\Carbon;
use App\Rules\UTCTimeShift;
use Illuminate\Support\Facades\DB;


use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatSessionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query()) {
            $validated = $request->validate([
                'created_at' => 'required|date',
                'end' => 'required|date',
                'showActiveSessions' => 'required|boolean',
                'zone' => ['required', new UTCTimeShift],
                'currentSession' => 'exists:chat_sessions,id'
            ]);
            $validated['created_at'] = Carbon::parse($validated['created_at'])->addMinutes($validated['zone']);
            $validated['end'] = Carbon::parse($validated['end'])->addMinutes($validated['zone']);
        } else {
            $validated = [
                'created_at' => Carbon::today()->startOfDay(),
                'end' => Carbon::today()->endOfDay(),
                'showActiveSessions' => true,
            ];
        }
        $options = [
            ['created_at', '>', $validated['created_at']],
            ['created_at', '<=', $validated['end']],
        ];
        if ($validated['showActiveSessions']) {
            $allSessions = DB::table('chat_sessions')->where($options)->whereNull('end')->orderBy('updated_at', 'desc');
        } else {
            $allSessions = DB::table('chat_sessions')->where($options)->orderBy('updated_at', 'desc');
        }
        // dd($allSessions->toSql());


        return Inertia::render('Chat', [
            'sessions' => $allSessions->get(),
            'currentSession' => Inertia::lazy(fn() => ChatSession::find($validated['currentSession'])->load('messages'))
        ]);
    }

}