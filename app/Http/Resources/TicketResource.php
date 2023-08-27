<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Hall;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'seat' => $this->seat,
            'seat_type' => $this->seat_type,
            'hall' => Hall::find($this->hall_id)->name,
        ];
    }
}
