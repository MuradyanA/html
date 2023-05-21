<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Seat;
use App\Models\Payment;
use App\Models\Seance;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Rules\PaymentCard;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Storage;
use View;


class PaymentController extends Controller
{
    public function show(Request $request)
    {

        $tickets =[
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl'],
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl'],
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl'],
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl'],
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl'],
            ['movieName' => 'Spider-Man', 'hour' => '15:00', 'date' => '31.04.2023', 'hall' => 'Blue', 'weekDay' => 'Monday', 'seat' => 5, 'seatType' => 'parterre', 'uuid'=>'9djkgbhjsdfgbkl3-fdkgsl']
        ];
            
        $dompdf = new Dompdf();
        $view = (string) View::make('tickets', ['tickets' => $tickets]);
        return $view;

    }
    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'name' => 'required|string',
            'cardNumber' => ['required', 'int', new PaymentCard],
            'amount' => 'required|int',
        ]);

        $payment = new Payment;
        $payment->name = $validated['name'];
        $payment->cardNumber = $validated['cardNumber'];
        $payment->amount = $validated['amount'];
        $payment->save();
        $allTickets = [];
        $seance = Seance::find($request->session()->get('seance_id'));
        $moviename = DB::table('movies')->select('movieName')->where('id', '=', $seance->movie_id)->get();
        
        $seats = Seat::select('seat', 'seatType')->whereIn('id', (session('seats')))->get();
        $data = [
            'movieName' => $moviename[0]->movieName,
            'hour' => $request->seance['hour'],
            'date' => Carbon::now()->endOfWeek($seance['weekday'])->format('D d-M-Y'),
            'hall' => $seance->load('hall')->hall->name,
        ];
        foreach ($seats as $seat) {
            $ticket = new Ticket;
            $ticket->movie_id = $seance['movie_id'];
            $ticket->seance_time = $seance['hour'];
            $ticket->seance_date = Carbon::now()->endOfWeek($seance['weekday']);
            $ticket->payment_id = $payment->id;
            $ticket->hall_id = $seance['hall_id'];
            $ticket->seat = $seat['seat'];
            if ($seat['seatType'] == 'parterre') {
                $ticket->ticket_price = $seance['parter_price'];
            }
            if ($seat['seatType'] == 'amphitheater') {
                $ticket->ticket_price = $seance['amphitheater_price'];
            }
            $ticket->seat_type = $seat['seatType'];
            $ticket->save();
            $data['seat'] = $seat['seat'];
            $data['seatType'] = $seat['seatType'];
            $data['uuid'] = $ticket->id;

            array_push($allTickets, $data);
            // $pdf = Pdf::loadView('tickets', ['tickets' => $data]);
            // $content = $pdf->download()->getOriginalContent();
            // return Pdf::loadFile(public_path().'/myfile.html')->save('/path-to/my_stored_file.pdf')->stream('download.pdf');
        }
        
    
        $dompdf = new Dompdf();
        $view = (string) View::make('tickets', ['tickets' => $allTickets]);
        $dompdf->loadHtml($view);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $pdfOutput = $dompdf->output();
        Storage::put("tickets/tickets-$payment->id.pdf", $pdfOutput);
        $url = Storage::url("tickets/tickets-$payment->id.pdf");
        $request->session()->put('paymentId', $payment->id);
        return to_route('welcome.index');
    }



    public function downloadTicket(Request $request)
    {
        $fileName = "tickets/tickets-" . $request->session()->get('paymentId') . ".pdf";
        if (Storage::exists($fileName)) {
            $request->session()->flush();
            return Storage::download($fileName, 'tickets.pdf');
        }
    }

}