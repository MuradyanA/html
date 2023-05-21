<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;
use App\Models\Movie;
use App\Models\Hall;

class Seance extends Model
{
    use HasFactory;
    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    static function getActualSeances(Carbon $date)
    {
        $moviestable = DB::table('movies')->select(DB::raw('id as movieId, movieName'));
        $firstTable = self::select(DB::raw('weekday, hour, MAX(created_at) as created_at'))
            ->where('starts', '<=', $date)
            ->groupBy('weekday', 'hour');

        $secondTable = self::joinSub($firstTable, 'firstTable', function (JoinClause $join) {
            $join->on('firstTable.weekday', '=', 'seances.weekday');
            $join->on('firstTable.hour', '=', 'seances.hour');
            $join->on('firstTable.created_at', '=', 'seances.created_at');
        })
        ->orderBy('seances.weekday', 'asc')
        ->orderBy('seances.hour', 'asc') 
        ->orderBy('seances.hall_id', 'asc');
        

        return $secondTable->joinSub($moviestable, 'movies', function (JoinClause $join) {
            $join->on('movies.movieId', '=', 'seances.movie_id');
        });
        // $secondTable->join('movies', 'movies.id', '=', 'seances.movie_id');

    }

}