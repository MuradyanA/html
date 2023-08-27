<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Payment;
use Carbon\Carbon;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cardNumber' => '**** **** **** ' . substr($this->cardNumber, 12, 16),
            'amount' => $this->amount,
            'status' => $this->status,
            'createdAt' => Carbon::parse($this->created_at)->format("Y-M-d h:i A"),
        ];
    }
}
