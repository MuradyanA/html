<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use DB;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;


class DashboardController extends Controller
{
    private function getStatistics()
    {
        $currentDate = Carbon::today();
        $currentWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $currentMonthBegin = Carbon::now()->startOfMonth();
        $incomeCurrentMonth = Payment::where([
            ['created_at', '>=', $currentMonthBegin],
            ['created_at', '<=', $currentDate]
        ])->sum('amount');

        $incomeLastWeek = Payment::where([
            ['created_at', '>=', $lastWeekStart],
            ['created_at', '<', $currentWeekStart]
        ])->sum('amount');

        $incomeThisWeek = Payment::where([
            ['created_at', '>=', $currentWeekStart],
            ['created_at', '<=', $currentDate]
        ])->sum('amount');

        return [
            'incomeCurrentMonth' => $incomeCurrentMonth,
            'incomeLastWeek' => $incomeLastWeek,
            'incomeThisWeek' => $incomeThisWeek
        ];
    }

    public function index(Request $request)
    {
        $payments = DB::table('payments')
            ->selectRaw('payments.id, name, amount, status, payments.created_at,
        (select DISTINCT t.seance_time from tickets t where t.payment_id = payments.id ) as SeanceTime,
        (select DISTINCT t.seance_date from tickets t where t.payment_id = payments.id ) as SeanceDate')

            ->orderBy('created_at', 'desc');

        if ($request->query('search')) {
            $query = $request->query('search');
            $payments->where('name', 'like', "%$query%");
        }
        ;

        if ($request->query('search')) {
            return Inertia::render('Dashboard', ['payments' => $payments->simplePaginate(5)->appends(['search' => $request->query('search')]), 'statistics' => fn() => $this->getStatistics()]);
        } else {
            return Inertia::render('Dashboard', [
                'payments' => $payments->simplePaginate(5),
                'statistics' => fn() => $this->getStatistics()
            ]);
        }

    }

    public function checkPayment(Payment $payment)
    {
        if ($payment->status == 'cancelled') {
        }

        if (Ticket::where([['payment_id', $payment->id], ['is_used', 1]])->exists()) {
            return Inertia::render('Dashboard', ['message' => 'Cannot cancel the payment, tickets are already used.']);
        } else {
            $payment->status = 'cancelled';
            $payment->save();
            Ticket::where('payment_id', $payment->id)->update(['status' => 'cancelled']);
        }
        return to_route('dashboard.index');

    }
}