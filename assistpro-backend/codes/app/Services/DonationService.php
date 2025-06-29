<?php

namespace App\Services;

use App\Entities\Donation;
use App\Repositories\Contracts\DonationRepositoryInterface;

class DonationService
{
    protected DonationRepositoryInterface $donationRepository;

    public function __construct(DonationRepositoryInterface $donationRepository)
    {
        $this->donationRepository = $donationRepository;
    }

    public function getAllPaginated(array $filters): array
    {
        return $this->donationRepository->getAllPaginated($filters);
    }

    public function getAllDonations(array $filters): array
    {
        return $this->donationRepository->getAll($filters);
    }

    public function createDonation(Donation $donation): Donation
    {
        $donationID = $this->donationRepository->save($donation);

        return $this->getDonationById($donationID);
    }

    public function getDonationById(int $id): ?Donation
    {
        return $this->donationRepository->find($id);
    }

    public function updateDonation(int $id, Donation $donation): bool
    {
        return $this->donationRepository->update($id, $donation);
    }

    public function deleteDonation(int $id): bool
    {
        return $this->donationRepository->delete($id);
    }

    public function getDonationsByStudent(int $studentId): array
    {
        return $this->donationRepository->getAllByStudentId($studentId);
    }
}
