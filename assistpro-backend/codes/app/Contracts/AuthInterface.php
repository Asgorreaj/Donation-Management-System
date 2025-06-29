<?php

namespace App\Contracts;

interface AuthInterface
{
    public function validate(): bool;
}
