<?php

namespace App\Repositories\Contracts;

interface DeleteRepositoryInterface
{
    public function delete(int $id): bool;
}
