<?php

namespace App\Repositories\Contracts;

interface PaginateRepositoryInterface
{
    public function getAllPaginated(array $filters): array;
}
