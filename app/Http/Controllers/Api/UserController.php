<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserCollection;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Filters\UserQuery;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filter = new UserQuery();
        
        $queryItems = $filter->transform($request);

        $users = User::select("id", "name", "email", "status", "isAdmin", "created_at")->where($queryItems)->get();
        return new UserCollection($users);
    }

    public function update(Request $request, User $user)
    {
        $userService = new UserService();
        $validated = $request->validate([
            'status' => 'boolean|nullable',
            'isAdmin' => 'boolean|nullable'
        ]);

        if($user->status != $validated['status']){
            $userService->changeDisabledState($user);
        }

        if($user->isAdmin != $validated['isAdmin']){
            $userService->changeUserRole($user);
        }

        return redirect()->action([UserController::class, 'index']);
    }
}
