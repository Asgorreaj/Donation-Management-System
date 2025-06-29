<?php

namespace App\Controllers\Api;

use App\Entities\Student;
use App\Services\Auth\AuthUserService;
use CodeIgniter\RESTful\ResourceController;

class StudentController extends ResourceController
{
    protected $studentService;
    protected $studentValidator;
    protected $studentResource;
    protected $donationService;

    // Constructor to initialize services and dependencies
    public function __construct()
    {
        $this->studentService = service('studentService');
        $this->studentValidator = service('studentValidator');
        $this->studentResource = service('studentResource');
        $this->donationService = service('donationService');
    }

    // Method to retrieve all students by filter and pagination
    public function index()
    {
        // Fetch all student records using the service
        $paginatedStudents = $this->studentService->getAllPaginated($this->request->getGet());

        // Prepare a response using the resource formatter
        $responseData = $this->studentResource->paginatedCollection(
            $paginatedStudents['data'], $paginatedStudents['pager']
        );

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to retrieve all students
    public function getAll()
    {
        // Fetch all student records using the service
        $students = $this->studentService->getAllStudents($this->request->getGet());

        // Prepare a response using the resource formatter
        $responseData = [
            'status' => 'success',
            'message' => 'Students retrieved successfully.',
            'data' => $students
        ];

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to create a new student record
    public function create()
    {
        // Get the data from the POST request
        $inputData = getInputData($this->request);
        $inputData['code'] = 001; // Assign a default code
        $inputData['branch_id'] = AuthUserService::getBranchId();

        // Validate the data using the student validator
        if (!$this->studentValidator->validateCreate($inputData)) {
            // Return validation errors if any
            return $this->failValidationErrors($this->studentValidator->validation->getErrors());
        }

        // Create a Student entity from the input data
        $studentEntity = new Student($inputData);

        // Create a new student record using the service
        $student = $this->studentService->createStudent($studentEntity);

        // Prepare a response using the resource formatter
        $responseData = $this->studentResource->respondResource($student->toArray());

        // Return the formatted response with a 201 (Created) status code
        return $this->respond($responseData, 201);
    }

    // Method to retrieve a student by ID
    public function show($id = null)
    {
        // Fetch the student record by ID using the service
        $student = $this->studentService->getStudentById($id);

        // Check if the student record exists
        if (!$student) {
            // Return a 404 (Not Found) response if student does not exist
            return $this->failNotFound('Student not found');
        }

        // Prepare a response using the resource formatter
        $responseData = $this->studentResource->respondResource($student->toArray());

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to update an existing student record
    public function update($id = null)
    {
        // Fetch the existing student record from the database
        $student = $this->studentService->getStudentById($id);
        if (!$student) {
            // Return a 404 (Not Found) response if student does not exist
            return $this->failNotFound('Student not found');
        }

        // Get raw input data from the PUT request
        $inputData = getInputData($this->request);

        // Validate the data using the student validator
        if (!$this->studentValidator->validateUpdate($inputData)) {
            // Return validation errors if any
            return $this->failValidationErrors($this->studentValidator->validation->getErrors());
        }

        // Check if there are any changes to update
        $existingData = $student->toArray();
        $changes = array_diff_assoc($inputData, $existingData);

        if (empty($changes)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'No changes detected',
                'data' => $student
            ]);
        }

        // Update the properties of the student entity with new data
        $student->fill($inputData);

        // Update the student record using the service
        $updated = $this->studentService->updateStudent($id, $student);
        if (!$updated) {
            // Return a 500 (Internal Server Error) response if the update fails
            return $this->fail('Failed to update the student', 500);
        }

        // Prepare a response using the resource formatter
        $responseData = $this->studentResource->respondResource($student->toArray());

        // Return the formatted response
        return $this->respond($responseData);
    }

public function delete($id = null)
{
    if (!$this->studentService->getStudentById($id)) {
        return $this->failNotFound('Student not found');
    }
    $donations = $this->donationService->getDonationsByStudent($id);
    if (!empty($donations)) {
        return $this->fail('This student has existing donations and cannot be deleted!', 400);
    }
        $this->studentService->deleteStudent($id);
        return $this->respond([
        'status' => 200,
        'message' => 'Student account deleted successfully.',
        'data' => null
    ]);
}

}
