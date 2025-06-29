<?php

namespace App\Repositories\Contracts;

use CodeIgniter\Entity\Entity;

interface CreateRepositoryInterface
{
    public function save(Entity $entity): int;
}
