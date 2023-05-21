<?php

namespace App\Http\Controllers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use App\Models\Hall;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HallController extends Controller
{
    public function show(Request $request, Hall $hall)
    {
        $hall->seats;
        return Inertia::render('Hall',  ['hall' => $hall]);
    }
    public function index()
    {

    }

    public function destroy()
    {

    }

    public function update()
    {

    }

    public function store()
    {

    }
}
