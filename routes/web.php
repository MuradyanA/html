<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Movie;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [WelcomeController::class, 'index'])->name('welcome.index')->middleware('web');
Route::get('/tickets', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/setSeance', [WelcomeController::class, 'setSeance'])->name('welcome.setSeance')->middleware('web');
Route::post('/setSeats', [WelcomeController::class, 'setSeats'])->name('welcome.setSeats')->middleware('web');
Route::post('/payment', [PaymentController::class, 'store'])->name('payment.store');
Route::get('/downloadTicket', [PaymentController::class, 'downloadTicket'])->name('payment.downloadTicket');


Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index')->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {

});
Route::get('/hall/{hall}', [HallController::class, 'show'])->name('hall.show');
// Route::get('/hall', [HallController::class, 'index'])->name('hall.index');


Route::middleware('auth')->group(function () {

    Route::get('/tickets/pass/{ticket}', [TicketController::class, 'checkTicket'])->name('tickets.checkTicket');
    Route::post('/movies/{movie}', [MovieController::class, 'update'])->name('movies.update');
    Route::get('/movies/create', function () {
        return Inertia::render('Createmovies');
    })->name('movies.create');
    Route::post('/movies', [MovieController::class, 'store'])->name('movies.store');
    Route::delete('/movies/{id}', [MovieController::class, 'destroy'])->name('movies.destroy');
    Route::get('/movies', [MovieController::class, 'index'])->name('movies.index');
    Route::get('/movies/{id}', [MovieController::class, 'show'])->name('movies.show');
});

Route::middleware('auth')->group(function () {
    Route::put('/seances/{seance}', [SeanceController::class, 'update'])->name('seances.update');
    Route::get('/seances/create', [SeanceController::class, 'create'])->name('seances.create');
    Route::post('/seances', [SeanceController::class, 'store'])->name('seances.store');
    Route::delete('/seances/{id}', [SeanceController::class, 'destroy'])->name('seances.destroy');
});

Route::get('/seances', [SeanceController::class, 'index'])->name('seances.index');



require __DIR__ . '/auth.php';