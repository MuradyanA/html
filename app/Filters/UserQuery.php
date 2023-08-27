<?php
namespace App\Filters;

use Illuminate\Http\Request;
use App\Filters\BaseQuery;

class UserQuery extends BaseQuery
{
    protected $allowedParms = [
        "name" => ['eq', 'like'],
    ];

    protected $columnMap = [
    ];
}