<?php

namespace App\Repositories;

use App\Entities\Donation;
use App\Models\DonationModel;
use App\Repositories\Contracts\DonationRepositoryInterface;
use App\Services\Auth\AuthUserService;
use CodeIgniter\Entity\Entity;

class DonationRepository implements DonationRepositoryInterface
{
    protected DonationModel $donation;
    protected StudentRepository $studentRepository;

    public function __construct()
    {
        $this->donation = new DonationModel();
        $this->studentRepository = service('studentRepository');
    }

    public function getAllPaginated(array $filters): array
    {
        // Number of records per page
        $perPage = array_key_exists('per_page', $filters)
            ? (int) $filters['per_page']
            : 25;

        $builder = $this->donation
            ->select('donations.*')
            ->orderBy('donations.id', 'DESC');

        // Apply a join with the students table
        $builder->join('students', 'students.id = donations.student_id', 'inner');

        // Filter donations by the branch ID from the authenticated user
        if (!empty($filters['branch_id']) && $filters['branch_id'] != -1) {
            $builder->where('students.branch_id', $filters['branch_id']);
        }

        // Apply search filter on both donations and students tables
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $builder->groupStart()
                ->like('students.name', $search) // Filter by student's name
                ->orLike('students.code', $search) // Filter by student's code
                ->groupEnd();
        }

        // Apply date filter for donations
        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $builder->where("donations.date BETWEEN '{$filters['date_from']}' AND '{$filters['date_to']}'");
        }

        // Paginate with the specified per-page count and retrieve paginated data
        $donations = $this->donation
            ->paginate($perPage);

        // Get all students related to the donations in a single query
        $studentIds = array_column($donations, 'student_id');
        $studentIds = array_unique($studentIds);
        if (!empty($studentIds)) {
            $students = $this->studentRepository->getByIds($studentIds);

            // Assign student to the corresponding donation
            foreach ($donations as $donation) {
                $studentId = $donation->student_id;
                $filteredStudents = array_filter($students, function ($student) use ($studentId) {
                    return $student->id === $studentId;
                });
                // Extract the first match
                $student = reset($filteredStudents);
                $donation->student = $student;
            }
        }

        return [
            'data' => $donations,
            'pager' => $this->donation->pager
        ];
    }

    public function getAll(array $filters): array
    {
        return $this->donation->findAll();
    }

    public function find(int $id): ?Donation
    {
        $donation = $this->donation->find($id);
        $donation->student = $donation->getStudent();

        return $donation;
    }

    public function save(Entity $donation): int
    {
        return $this->donation->insert($donation);
    }

    public function update(int $id, Entity $donation): bool
    {
        return $this->donation->update($id, $donation);
    }

    public function delete(int $id): bool
    {
        return $this->donation->delete($id);
    }

    public function getAllByStudentId(int $studentId): array
    {
        return $this->donation->where('student_id', $studentId)->findAll();
    }
}
