<?php

namespace App\Repositories;

use App\Entities\Student;
use App\Models\StudentModel;
use App\Repositories\Contracts\StudentRepositoryInterface;
use App\Services\Auth\AuthUserService;
use CodeIgniter\Entity\Entity;

class StudentRepository implements StudentRepositoryInterface
{
    protected StudentModel $student;

    public function __construct()
    {
        $this->student = new StudentModel();
    }

    public function getAllPaginated(array $filters): array
    {
        // Number of records per page
        $perPage = array_key_exists('per_page', $filters)
            ? (int) $filters['per_page']
            : 25;

        $builder = $this->student
            ->orderBy('id', 'DESC');

        if (!empty($filters['branch_id']) && $filters['branch_id'] != -1) {
            $builder->where('branch_id', $filters['branch_id']);
        }

        // Apply search filter if provided
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $builder->groupStart() // To encapsulate the OR conditions
            ->like('name', $search)
                ->orLike('code', $search)
                ->groupEnd();
        }

        // Apply status filter if provided
        if (!empty($filters['status'])) {
            $builder->where('status', $filters['status']);
        }

        // Paginate with the specified per-page count and retrieve paginated data
        $students = $builder
            ->paginate($perPage);

        return [
            'data' => $students,
            'pager' => $this->student->pager
        ];
    }

    public function getAll(array $filters = []): array
    {
        $builder = $this->student
            ->select("CONCAT(students.name, ' [', students.code, ']') AS label, students.id AS key")
            ->orderBy('students.name');

        // Apply search filter if provided
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $builder->groupStart() // To encapsulate the OR conditions
            ->like('name', $search)
                ->orLike('code', $search)
                ->groupEnd();
        }

        // Apply limit filter if provided
        if (!empty($filters['limit'])) {
            $builder->limit((int) $filters['limit']);
        }

        return $builder->get()->getResultArray(); // Use getResultArray for consistent output
    }

    public function getByIds(array $ids):array
    {
        return $this->student->whereIn('id', $ids)->findAll();
    }

    public function find(int $id): ?Student
    {
        return $this->student->find($id);
    }

    public function save(Entity $student): int
    {
        return $this->student->insert($student);
    }

    public function update(int $id, Entity $student): bool
    {
        return $this->student->update($id, $student);
    }

    public function delete(int $id): bool
    {
        return $this->student->delete($id);
    }
}
