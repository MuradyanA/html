<?php
namespace App\Services;
use App\Models\User;

class UserService {
    function changeUserRole(User $user){
        $user->isAdmin = !$user->isAdmin;
        return $user->save();
        
    }

    function changeDisabledState(User $user){
        $user->status = !$user->status;
        return $user->save();
    }

}



