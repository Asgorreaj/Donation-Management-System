<?php

namespace App\Repositories\Contracts;

interface ReadRepositoryInterface
{
    public function find(int $id);

    public function getAll(array $filters): array;
}
