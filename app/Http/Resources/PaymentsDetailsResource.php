<?php

namespace App\Http\Resources;

use App\Models\Movie;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Payment;
use Carbon\Carbon;

class PaymentsDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstTicket = $this->tickets()->first();
        $movieName = Movie::find(Ticket::find($firstTicket->id)->movie_id)->movieName;
        $seanceDate = $firstTicket->seance_date;
        $seanceTime = $firstTicket->seance_time;
        return [
            'id' => $this->id,
            'movie' => $movieName,
            'seance_date' => $seanceDate,
            'seance_time' => $seanceTime,
            'tickets' => new TicketCollection($this->tickets)
        ];
    }
}


