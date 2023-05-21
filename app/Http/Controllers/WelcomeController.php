<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Ticket;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Seance;
use App\Models\Seat;
use Inertia\Inertia;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $responseData = [
            'movies' => fn() => $this->getMovies(),
            'halls' => fn() => Hall::with([
                'seats' => function (Builder $query) {
                    $query->select('id', 'seat', 'seatType', 'hall_id');
                }
            ])->select('id', 'name')->get(),
        ];
        if (session('seats')) {
            $responseData['chosenSeats'] = Seat::select('id', 'seat', 'seatType', 'hall_id')->whereIn('id', $request->session()->get('seats'))->get();
        }
        if ($request->session()->get('seance_id')) {
            $seance = Seance::find($request->session()->get('seance_id'));
            $reservedSeats = Ticket::select('seat')->where(
                [
                    ['seance_date', '=', Carbon::now()->endOfWeek($seance['weekday'])->format('y-m-d')],
                    ['seance_time', '=', $seance['hour']],
                    ['hall_id', '=', $seance['hall_id']],
                ]
            )->get()->pluck('seat');
            $responseData['chosenSeance'] = Seance::select('weekDay', 'hour', 'movie_id', 'hall_id', 'parter_price', 'amphitheater_price')->where('id', $request->session()->get('seance_id'))->first();
            $responseData['reservedSeats'] = $reservedSeats;
            // dd($responseData);

        }
        return Inertia::render('Welcome', $responseData);


        // ['movies'=> [$movie['seances'], $movie], // every movie includes its seansces
        // 'chosenSeats'=>[$chosenSeats], // if exists in the session
        // 'chosenSeance'=>$chosenSeance, // if exists in the session
        // 'halls' =>$halls // with seats. Includes only halls that have seances        ]

    }

    public function setSeance(Request $request)
    {
        $validated = $request->validate([
            'seance.id' => 'exists:seances,id'
        ]);
        $request->session()->put('seance_id', $validated['seance']['id']);
        
        return to_route('welcome.index');

    }

    public function setSeats(Request $request)
    {
        $validated = $request->validate([
            'seats.*.id' => 'exists:seats,id'
        ]);
        $request->session()->put('seats', Arr::flatten($validated['seats']));

        return to_route('welcome.index');
    }

    private function getMovies()
    {
        $currentDay = Carbon::parse('today');
        $seancesCreationTime = Seance::select(DB::raw('movie_id, weekday, hour, MAX(created_at) as created_at'))
            ->where('starts', '<=', $currentDay)
            ->groupBy('hour', 'weekday', 'movie_id')
            ->get()
            ->pluck('created_at');

        $seances = Seance::select(DB::raw('id, movie_id, hall_id, weekday, hour, created_at, parter_price, amphitheater_price, starts'))
            ->whereIn('created_at', $seancesCreationTime)->get();

        $movies = DB::table('movies')->select(DB::raw('id, movieName, poster, description, genre, duration'))
            ->whereIn('id', $seances->pluck('movie_id'))->get();

        foreach ($movies as $movie) {
            $movie->seances = $seances->filter(function ($value) use ($movie) {
                return $value->movie_id == $movie->id;
            });
            // dd($movie->seances);
            $movie->seances->sort(function ($prev, $current) {
                return $prev->weekday <=> $current->weekday;
            });
            $seancesBefore = $movie->seances->filter(function ($value) use ($currentDay) {
                return $value->weekday <= $currentDay->weekday();
            });
            $movie->seances = $movie->seances->diff($seancesBefore)->concat($seancesBefore);
        }
        return $movies;
    }
}

// $actualSeances = Seance::getActualSeances($currentDay)->get();
// $actualSeances->load('movie:id,description,poster,genre,duration');
// $prevDays = $actualSeances->filter(function($value) use ($currentDay){
//     return $value->weekday <= $currentDay->weekday();
// });
// 
// // $moviesInfo = DB::table('movies')->where('description', 'duration', 'starts')->get();
// // dd($sortedAndGroupedSeances);