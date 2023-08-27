<?php
namespace App\Filters;

use Illuminate\Http\Request;
use App\Filters\BaseQuery;

class PaymentQuery extends BaseQuery
{
    protected $allowedParms = [
        "name" => ['eq', 'like'],
        "start" => ["gt", "lt", "eq", "gte", "lte"],
        "end" => ["gt", "lt", "eq", "gte", "lte"],
        "payment_id" => ['eq'],

    ];

    protected $columnMap = [
        "start" => "created_at",
        "end" => "created_at"
    ];
}