<?php

namespace App\Validators;

use CodeIgniter\Validation\ValidationInterface;

class DonationValidator
{
    public ValidationInterface $validation;

    public function __construct(ValidationInterface $validation)
    {
        $this->validation = $validation;
    }

    public function validateCreate(array $data): bool
    {
        return $this->validation->setRules([
            'student_id'       => [
                'label' => 'student',
                'rules' => 'required|integer|exists[students.id]',
            ],
            'date'             => 'required|valid_date',
            'amount'           => 'required|decimal|greater_than_equal_to[0]',
            'mode_of_payment'  => 'required|in_list[cash,bank]',
            'bank_name'        => 'required_if[mode_of_payment,bank]|string|max_length[255]',
            'check_no'         => 'required_if[mode_of_payment,bank]|string|max_length[50]',
        ])->run($data);
    }

    public function validateUpdate(array $data): bool
    {
        return $this->validateCreate($data);  // Assuming same rules for update
    }
}
