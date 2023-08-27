<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'status' => $this->status ? 'Enabled' : 'Disabled',
            'isAdmin' => $this->isAdmin ? 'Admin' : 'Controller',
            'createdAt' => Carbon::parse($this->created_at)->format("Y-M-d h:i A"),
        ];
    }
}
