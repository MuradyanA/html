<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
class TicketController extends Controller
{
    public function checkTicket(Ticket $ticket){
        $scanedTicket = Ticket::where('id',$ticket->id)->first();
        if($scanedTicket['is_used']==0){
            $scanedTicket['is_used']=1;
            $scanedTicket->save();
            return view('checkTicket',['isValid' => true]);
        }else{
            return view('checkTicket',['isValid' => false]);
        }
    }
}
