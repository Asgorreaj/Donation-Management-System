<?php

namespace App\Services\Auth;

use App\Contracts\AuthInterface;

class AuthService
{
    protected AuthInterface $authStrategy;

    public function __construct(AuthInterface $authStrategy)
    {
        $this->authStrategy = $authStrategy;
    }

    public function validate($credentials): bool
    {
        return $this->authStrategy->validate($credentials);
    }
}
