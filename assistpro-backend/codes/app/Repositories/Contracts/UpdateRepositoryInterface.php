<?php

namespace App\Repositories\Contracts;

use CodeIgniter\Entity\Entity;

interface UpdateRepositoryInterface
{
    public function update(int $id, Entity $entity): bool;
}
