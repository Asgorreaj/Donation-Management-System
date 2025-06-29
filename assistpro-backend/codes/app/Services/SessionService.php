<?php

namespace App\Services;

use App\Services\Auth\AuthUserService;

class SessionService
{
    public static function setUserData(array $userData, array $systemData): void
    {
        session()->set('user', (object)$userData);
        session()->set('sys', (object)$systemData);
        AuthUserService::setUser(session('user'));
    }
}

