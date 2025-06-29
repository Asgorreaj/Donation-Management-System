<?php

namespace App\Entities;

use App\Repositories\Contracts\DonationRepositoryInterface;
use CodeIgniter\Entity\Entity;

class Student extends Entity
{
    protected DonationRepositoryInterface $donationRepository;

    public function __construct(?array $data = null)
    {
        parent::__construct($data);
        $this->donationRepository = service('donationRepository');
    }

    public function getDonations()
    {
        return $this->donationRepository->getAllByStudentId($this->id);
    }
}

