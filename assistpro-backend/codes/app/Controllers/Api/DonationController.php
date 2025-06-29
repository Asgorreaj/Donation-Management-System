<?php

namespace App\Controllers\Api;

use App\Entities\Donation;
use CodeIgniter\RESTful\ResourceController;

class DonationController extends ResourceController
{
    protected $donationService;
    protected $donationValidator;
    protected $donationResource;

    // Constructor to initialize services and dependencies
    public function __construct()
    {
        $this->donationService = service('donationService');
        $this->donationValidator = service('donationValidator');
        $this->donationResource = service('donationResource');
    }

    // Method to retrieve all donations
    public function index()
    {
        // Fetch all donation records using the service
        $paginatedDonations = $this->donationService->getAllPaginated($this->request->getGet());

        // Prepare a response using the resource formatter
        $responseData = $this->donationResource->paginatedCollection(
            $paginatedDonations['data'], $paginatedDonations['pager']
        );

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to create a new donation record
    public function create()
    {
        // Get the data from the POST request
        $inputData = getInputData($this->request);

        // Validate the data using the donation validator
        if (!$this->donationValidator->validateCreate($inputData)) {
            // Return validation errors if any
            return $this->failValidationErrors($this->donationValidator->validation->getErrors());
        }

        // Create a Donation entity from the input data
        $donationEntity = new Donation($inputData);

        // Create a new donation record using the service
        $donation = $this->donationService->createDonation($donationEntity);

        // Prepare a response using the resource formatter
        $responseData = $this->donationResource->respondResource($donation->toArray());

        // Return the formatted response with a 201 (Created) status code
        return $this->respond($responseData, 201);
    }

    // Method to retrieve a donation by ID
    public function show($id = null)
    {
        // Fetch the donation record by ID using the service
        $donation = $this->donationService->getDonationById($id);

        // Check if the donation record exists
        if (!$donation) {
            // Return a 404 (Not Found) response if donation does not exist
            return $this->failNotFound('Donation not found');
        }

        // Prepare a response using the resource formatter
        $responseData = $this->donationResource->respondResource($donation->toArray());

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to update an existing donation record
    public function update($id = null)
    {
        // Fetch the existing donation record from the database
        $donation = $this->donationService->getDonationById($id);
        if (!$donation) {
            // Return a 404 (Not Found) response if donation does not exist
            return $this->failNotFound('Donation not found');
        }

        // Get raw input data from the PUT request
        $inputData = getInputData($this->request);

        // Validate the data using the donation validator
        if (!$this->donationValidator->validateUpdate($inputData)) {
            // Return validation errors if any
            return $this->failValidationErrors($this->donationValidator->validation->getErrors());
        }

        // Check if there are any changes to update
        $existingData = $donation->toArray();
        $changes = array_diff_assoc($inputData, $existingData);

        if (empty($changes)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'No changes detected',
                'data' => $donation
            ]);
        }

        // Update the properties of the student entity with new data
        $donation->fill($inputData);

        // Update the donation record using the service
        $updated = $this->donationService->updateDonation($id, $donation);
        if (!$updated) {
            // Return a 500 (Internal Server Error) response if the update fails
            return $this->fail('Failed to update the donation', 500);
        }

        // Prepare a response using the resource formatter
        $responseData = $this->donationResource->respondResource($donation->toArray());

        // Return the formatted response
        return $this->respond($responseData);
    }

    // Method to delete a donation record by ID
    public function delete($id = null)
    {
        // Check if the donation record exists
        if (!$this->donationService->getDonationById($id)) {
            // Return a 404 (Not Found) response if donation does not exist
            return $this->failNotFound('Donation not found');
        }

        // Delete the donation record using the service
        $this->donationService->deleteDonation($id);

        // Prepare a response with no content
        $responseData = $this->donationResource->respondResource(null);

        // Return the formatted response
        return $this->respond($responseData);
    }
}
