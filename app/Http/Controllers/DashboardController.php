<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $payments = DB::table('payments')
            ->selectRaw('payments.id, name, amount, status, payments.created_at,
        (select DISTINCT t.seance_time from tickets t where t.payment_id = payments.id ) as SeanceTime,
        (select DISTINCT t.seance_date from tickets t where t.payment_id = payments.id ) as SeanceDate')

                    ->orderBy('created_at', 'desc')
            ->simplePaginate(5);
        return Inertia::render('Dashboard', ['payments' => $payments]);
    }
}