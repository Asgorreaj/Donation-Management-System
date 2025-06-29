<?php

namespace App\Repositories\Contracts;

interface StudentRepositoryInterface extends
    CreateRepositoryInterface,
    ReadRepositoryInterface,
    UpdateRepositoryInterface,
    DeleteRepositoryInterface,
    PaginateRepositoryInterface
{
    public function getByIds(array $ids):array;
}
