<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Seance;
use App\Models\Ticket;
class CheckMovie implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(Ticket::where('movie_id',$value)->exists() || Seance::where('movie_id',$value)->exists()){
            $fail("Cannot delete the movie, beacuse it has seances or tickets");
        }
    }
}
