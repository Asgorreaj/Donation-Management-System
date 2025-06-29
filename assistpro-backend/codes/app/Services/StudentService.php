<?php

namespace App\Services;

use App\Entities\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;

class StudentService
{
    protected StudentRepositoryInterface $studentRepository;

    public function __construct(StudentRepositoryInterface $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function getAllPaginated(array $filters): array
    {
        return $this->studentRepository->getAllPaginated($filters);
    }

    public function getAllStudents(array $filters): array
    {
        return $this->studentRepository->getAll($filters);
    }

    public function createStudent(Student $student): Student
    {
        $studentID = $this->studentRepository->save($student);

        return $this->getStudentById($studentID);
    }

    public function getStudentById(int $id): ?Student
    {
        return $this->studentRepository->find($id);
    }

    public function updateStudent(int $id, Student $student): bool
    {
        return $this->studentRepository->update($id, $student);
    }

    public function deleteStudent(int $id): bool
    {
        return $this->studentRepository->delete($id);
    }
}
