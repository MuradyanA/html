<?php


use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentsDetailsController;
use App\Http\Controllers\Api\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $validated['email'])->first();
    if ($user == null) {
        throw ValidationException::withMessages([
            'email' => "The provided credentials are incorrect."
        ]);
    }

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }
    $user->tokens()->delete();
    if ($user->isAdmin) {
        $token = $user->createToken('admin-token', ['admin']);
    } else {
        $token = $user->createToken('controller-token', ['controller']);
    }

    return [
        'token' => $token->plainTextToken
    ];

});

Route::apiResource('/payments', PaymentController::class)->middleware('auth:sanctum');
Route::get('/users', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::put('/users/{user}', [UserController::class, 'update'])->middleware('auth:sanctum');