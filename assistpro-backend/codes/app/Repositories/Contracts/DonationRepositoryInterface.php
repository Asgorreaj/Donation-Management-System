<?php

namespace App\Repositories\Contracts;

interface DonationRepositoryInterface extends
    CreateRepositoryInterface,
    ReadRepositoryInterface,
    UpdateRepositoryInterface,
    DeleteRepositoryInterface,
    PaginateRepositoryInterface
{

}
