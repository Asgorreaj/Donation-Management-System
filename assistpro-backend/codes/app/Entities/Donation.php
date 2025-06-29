<?php

namespace App\Entities;

use App\Repositories\Contracts\StudentRepositoryInterface;
use CodeIgniter\Entity\Entity;

class Donation extends Entity
{
    protected StudentRepositoryInterface $studentRepository;

    public function __construct(?array $data = null)
    {
        parent::__construct($data);
        $this->studentRepository = service('studentRepository');
    }

    public function getStudent()
    {
        return $this->studentRepository->find($this->student_id);
    }
}

