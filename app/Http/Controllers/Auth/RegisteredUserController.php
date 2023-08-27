<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;


class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */

     public function __construct()
     {
         $this->authorizeResource(User::class, 'user');
     }

    public function index(Request $request){
        $users = DB::table('users')->selectRaw('id, status, isAdmin, name, email, created_at');
        
        if ($request->query('search')) {
            $query = $request->query('search');
            $users->where('name', 'like', "%$query%");
        }
        ;

        if ($request->query('search')) {
            return Inertia::render('Users', ['users' => $users->simplePaginate(5)->appends(['search' => $request->query('search')])]);
        } else {
            return Inertia::render('Users', [
                'users' => $users->simplePaginate(4),
            ]);
        }
    }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function update(Request $request, User $user)
    {
        $userService = new UserService();
        $userService->changeDisabledState($user);
        return to_route('users.index');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        return to_route('users.index');
    }

    public function changeUserRole(Request $request, User $user)
    {
        $userService = new UserService();
        $userService->changeUserRole($user);
        return to_route('users.index');
    }

}
