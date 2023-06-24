<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;

class CheckBanned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    if(auth()->check() && (auth()->user()->status == 0)){
        // dd(auth()->user());
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            Session::flash('message', 'Your Account is suspended, please contact Admin.');

            return redirect()->route('login');

    }

    return $next($request);
}
}
