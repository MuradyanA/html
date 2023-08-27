<?php
namespace App\Filters;

use Illuminate\Http\Request;

class BaseQuery
{
    protected $allowedParms = [
    
    ];

    protected $columnMap = [

    ];

    protected $operatorMap = [
        "eq" => "=",
        "like" => "like",
        "lt" => "<",
        "lte" => "<=",
        "gt" => ">",
        "gte" => ">=",
    ];

    public function transform(Request $request)
    {
        $eloQuery = [];

        foreach ($this->allowedParms as $parm => $operators) {
            $query = $request->query($parm);
            if (!isset($query)) {
                continue;
            }

            $column = $this->columnMap[$parm] ?? $parm;
            if (isset($query)) {
                foreach ($operators as $operator) {
                    if (isset($query[$operator])) {
                        if ($operator == "like") {
                            array_push($eloQuery, [$column, $this->operatorMap[$operator], "%$query[$operator]%"]);
                        } else {
                            array_push($eloQuery, [$column, $this->operatorMap[$operator], $query[$operator]]);
                        }
                    }
                }
            }
        }

        return $eloQuery;
    }
}