<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Seance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Validator;
use Carbon\CarbonPeriod;
use Carbon\CarbonInterval;

class SeanceController extends Controller
{
    public function index(Request $request)
    {
        $currentDate = Carbon::today();
        $data = [];
        if ($request->query('all')) {
            $seances = Seance::select('seances.id', 'weekday', 'hour', 'hall_id', 'seances.created_at', 'starts', 'movies.movieName')
                ->join('movies', 'seances.movie_id', '=', 'movies.id')
                ->orderBy('seances.weekday', 'asc')
                ->orderBy('seances.hour', 'asc')
                ->orderBy('seances.hall_id', 'asc')
                ->simplePaginate(10);
        } else if ($request->query('date')) {
            $currentDate = Carbon::parse($request->query('date'));
            $seances = Seance::getActualSeances($currentDate)->simplePaginate(10);
            $data['currentDate'] = $currentDate->toDateString();
        } else {
            $data['currentDate'] = $currentDate->toDateString();
            $seances = Seance::getActualSeances($currentDate)->simplePaginate(10);
        }
        // dd($seances)
        $data['seances'] = $seances;
        return inertia::render('Seances', $data);
    }
    public function create(Request $request, User $user)
    {
        $this->authorize('create', $user);
        //dd($request->query('search'));
        $queryString = $request->query('search');
        if ($queryString) {
            $movies = DB::table('movies')->where('movieName', 'like', "%$queryString%")->orderByDesc('created_at')->limit(5)->get();
        } else {
            $movies = DB::table('movies')->orderByDesc('created_at')->limit(5)->get();
        }
        return inertia::render('Createseances', ['movies' => $movies]);

    }

    public function destroy(Request $request)
    {
        $seanceTable = DB::table('seances')
            ->where('id', '=', $request->id)
            ->delete();
    }

    public function update()
    {

    }
    private function getMoviePeriod($movie, $start, $duration)
    {
        list($hours, $minutes) = explode(':', $duration);
        $movieStart = Carbon::now()->setTimeFromTimeString($start);
        $movieEnd = clone $movieStart;
        $movieEnd->add(CarbonInterval::hours($hours)->minutes($minutes + 20)) ;
        return CarbonPeriod::create($movieStart, $movieEnd);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'sunday' => 'required|boolean',
            'monday' => 'required|boolean',
            'tuesday' => 'required|boolean',
            'wednesday' => 'required|boolean',
            'thursday' => 'required|boolean',
            'friday' => 'required|boolean',
            'saturday' => 'required|boolean',
            'hour' => 'required|date_format:H:i',
            'movie_id' => 'required|exists:movies,id',
            'hall_id' => 'required|exists:halls,id', Rule::in(['1', '2']),
            'starts' => 'required|date|before_or_equal:ends',
            'ends' => 'required|date',
            'parter_price' => 'required',
            'amphitheater_price' => 'required',
        ]);

        $validator->after(function ($validator) {
            $weekDaysArray = $validator->safe()->only(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
            $weekDaysArray = array_filter($weekDaysArray, function ($value) {
                return $value;
            });

            $weekDayToNumber = function ($value) {
                return Carbon::parse($value)->weekday();
            };


            $weekDayNumbers = array_map($weekDayToNumber, array_keys($weekDaysArray));
            $newSeanceMovie = Movie::find($validator->safe()->only('movie_id'))->first();
            $newMoviePeriod = $this->getMoviePeriod($newSeanceMovie, $validator->safe()->only('hour')['hour'], $newSeanceMovie->duration);

            foreach ($weekDayNumbers as $weekday) {
                $seances = Seance::getActualSeances(Carbon::now(), $validator->safe()->only(['hall_id'])['hall_id'], strval($weekday))->get();
                foreach ($seances as $seance) {
                    $seance->load('movie');
                    $existingSeancePeriod = $this->getMoviePeriod($seance->movie, $seance->hour, $seance->movie->duration);
                    if($newMoviePeriod->overlaps($existingSeancePeriod)){
                        $validator->errors()->add(
                            'start', "The current seance will overlap the seance with id:$seance->id "
                        );
                    }
                }
            }
            // if ($this->somethingElseIsInvalid()) {
            //     $validator->errors()->add(
            //         'field', 'Something is wrong with this field!'
            //     );
            // }
        })->validate();
        $validated = $validator->validated();
        $weekdays = [
            'sunday' => $validated['sunday'],
            'monday' => $validated['monday'],
            'tuesday' => $validated['tuesday'],
            'wednesday' => $validated['wednesday'],
            'thursday' => $validated['thursday'],
            'friday' => $validated['friday'],
            'saturday' => $validated['saturday']
        ];

        foreach ($weekdays as $day => $value) {
            if ($value) {
                $seance = new Seance();
                $seance->weekday = (string) Carbon::parse($day)->weekday();
                $seance->hour = $validated['hour'];
                $seance->movie_id = $validated['movie_id'];
                $seance->hall_id = $validated['hall_id'];
                $seance->starts = $validated['starts'];
                $seance->ends = $validated['ends'];
                $seance->parter_price = $validated['parter_price'];
                $seance->amphitheater_price = $validated['amphitheater_price'];
                $seance->save();
            }
        }
        return to_route('seances.create');
    }
}