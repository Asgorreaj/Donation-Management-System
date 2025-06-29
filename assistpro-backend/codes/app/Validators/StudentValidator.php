<?php

namespace App\Validators;

use CodeIgniter\Validation\ValidationInterface;

class StudentValidator
{
    public ValidationInterface $validation;

    public function __construct(ValidationInterface $validation)
    {
        $this->validation = $validation;
    }

    public function validateCreate(array $data): bool
    {
        return $this->validation->setRules([
            'name'             => 'required|string|max_length[255]',
            'father_name'      => 'required|string|max_length[255]',
            'mother_name'      => 'required|string|max_length[255]',
            'gender'           => 'required|in_list[Male,Female,Other]',
            'address_present'  => 'permit_empty|string|max_length[500]',
            'address_permanent'=> 'permit_empty|string|max_length[500]',
            'nid'              => 'permit_empty|string|max_length[20]',
            'institution'      => 'required|string|max_length[255]',
            'year'             => 'permit_empty|integer',
            'status'           => 'required|in_list[Active,Inactive]',
        ])->run($data);
    }

    public function validateUpdate(array $data): bool
    {
        return $this->validateCreate($data);  // Assuming same rules for update
    }
}
