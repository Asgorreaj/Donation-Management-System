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

    // Bulk import students from a CSV file.
    // Expected columns (header row required):
    // name,father_name,mother_name,gender,address_present,address_permanent,nid,institution,year,status
    public function import()
    {
        $file = $this->request->getFile('file');

        if (!$file || !$file->isValid()) {
            return $this->fail('Please upload a valid CSV file.', 400);
        }

        $handle = fopen($file->getTempName(), 'r');
        if (!$handle) {
            return $this->fail('Unable to read the uploaded file.', 400);
        }

        $header = fgetcsv($handle);
        $header = array_map(static fn($h) => strtolower(trim($h)), $header);

        $created = 0;
        $errors = [];
        $rowNum = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $rowNum++;
            if (count($row) === 1 && trim($row[0]) === '') {
                continue; // skip blank lines
            }

            $rowData = array_combine($header, $row);

            $inputData = [
                'code'              => 1,
                'name'              => $rowData['name'] ?? null,
                'father_name'       => $rowData['father_name'] ?? null,
                'mother_name'       => $rowData['mother_name'] ?? null,
                'gender'            => $rowData['gender'] ?? 'Male',
                'address_present'   => $rowData['address_present'] ?? null,
                'address_permanent' => $rowData['address_permanent'] ?? null,
                'nid'               => $rowData['nid'] ?? null,
                'institution'       => $rowData['institution'] ?? null,
                'year'              => $rowData['year'] ?? null,
                'status'            => $rowData['status'] ?? 'Active',
                'branch_id'         => AuthUserService::getBranchId(),
            ];

            if (!$this->studentValidator->validateCreate($inputData)) {
                $errors[] = ['row' => $rowNum, 'errors' => $this->studentValidator->validation->getErrors()];
                continue;
            }

            $this->studentService->createStudent(new Student($inputData));
            $created++;
        }

        fclose($handle);

        return $this->respond([
            'status'  => 200,
            'message' => "Imported {$created} student(s) successfully.",
            'errors'  => $errors,
        ]);
    }

}