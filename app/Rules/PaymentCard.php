<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PaymentCard implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!is_numeric($value)){
            $fail("The :attribute  must consist of numbers!");
        }
        if(strlen($value)!=16){
            $fail("The :attribute  length must have 16 digits!");
        }
        if(!in_array($value[0], [4,5])){
            $fail("The :attribute must start with 4 or 5 digits!");
        }
    }
}
