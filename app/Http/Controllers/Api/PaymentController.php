<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\PaymentCollection;
use App\Http\Resources\PaymentsDetailsResource;
use App\Models\Movie;
use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Models\Payment; 
use App\Filters\PaymentQuery;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = new PaymentQuery();
        
        $queryItems = $filter->transform($request);
        return new PaymentCollection(Payment::where($queryItems)->get());

    }

    /**
     * Show the form for creating a new resource.
     */
  
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return new PaymentsDetailsResource($payment);
    }

    /**
     * Show the form for editing the specified resource.
     */
  
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $payment->status = 'cancelled';
        $payment->save();
        return Redirect::route('payments.index', $request->query());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
