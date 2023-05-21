<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SeanceController extends Controller
{
    public function index(Request $request)
    {
        $currentDate = Carbon::today();
        $data = [];
        if ($request->query('all')) {
            $seances = Seance::select('seances.id', 'weekday', 'hour','hall_id', 'seances.created_at', 'starts', 'movies.movieName')
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
    public function create(Request $request)
    {
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

    public function store(Request $request)
    {
        ($request->movie_id);
        $validated = $request->validate([
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
            'starts' => 'required|date',
            'parter_price' => 'required',
            'amphitheater_price' => 'required',
        ]);

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
                $seance->parter_price = $validated['parter_price'];
                $seance->amphitheater_price = $validated['amphitheater_price'];
                $seance->save();
            }
        }
        return to_route('seances.create');
    }
}