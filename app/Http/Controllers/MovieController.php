<?php

namespace App\Http\Controllers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use App\Models\Movie;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Rules\CheckMovie;


class MovieController extends Controller
{

    public function index(Request $request)
    {
        $movies = DB::table('movies')->simplePaginate(4);
        return Inertia::render('AllMovies', $movies);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => [new CheckMovie]
        ]);
        dd($validated);
        $movieTable = DB::table('movies')
            ->where('id', '=', $request->id)
            ->delete();

    }

    public function update(Request $request, Movie $movie)
    {
        $validated = $request->validate([
            'movieName' => 'required|string|max:100',
            'genre' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'realiseDate' => 'string|date',
            'image' => [
                'nullable',
                File::image()
                    ->max(12 * 1024)
            ]
        ]);
        

        $movie->movieName = $validated['movieName'];
        $movie->genre = $validated['genre'];
        $movie->description = $validated['description'];
        $movie->realiseDate = $validated['realiseDate'];

        if ($request->file('image')) {
            Storage::delete($movie->poster);
            $path = $request->file('image')->store('public');
            $movie->poster = Storage::url($path);

        }
        $movie->save();

        return to_route('movies.index');

    }

    public function store(Request $request, Movie $movie)
    {
        // Storage::disk('local')->append('moviesInfo.txt', $request->movieName);
        echo asset('storage/moviesInfo.txt');
        $validated = $request->validate([
            'movieName' => 'required|max:100',
            'genre' => 'required|max:100',
            'duration' => 'required|date_format:H:i',
            'description' => 'required|max:255',
            'realiseDate' => 'required|date',
            'poster' => [
                'required',
                File::image()
                    ->max(12 * 1024)
            ]
        ]);
        $movie = new Movie;
        $movie->movieName = $request->movieName;
        $movie->genre = $request->genre;
        $movie->duration = $request->duration;
        $movie->description = $request->description;
        $movie->realiseDate = $request->realiseDate;
        $path = $request->file('poster')->store('public');
        $movie->poster = Storage::url($path);
        $movie->save();
        return to_route('movies.create');
    }
}