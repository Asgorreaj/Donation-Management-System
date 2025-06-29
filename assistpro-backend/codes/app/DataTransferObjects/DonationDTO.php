<?php

namespace App\DataTransferObjects;

class DonationDTO extends BaseDTO
{
    public function __construct(
        public ?int    $id = null,
        public int     $student_id,
        public string  $date,
        public float   $amount,
        public string  $mode_of_payment,
        public ?string $bank_name = null,
        public ?string $check_no = null,
        public ?string $created_at = null,
        public ?string $updated_at = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            student_id: $data['student_id'],
            date: $data['date'],
            amount: $data['amount'],
            mode_of_payment: $data['mode_of_payment'],
            bank_name: $data['bank_name'] ?? null,
            check_no: $data['check_no'] ?? null,
            created_at: $data['created_at'] ?? null,
            updated_at: $data['updated_at'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'date' => $this->date,
            'amount' => $this->amount,
            'mode_of_payment' => $this->mode_of_payment,
            'bank_name' => $this->bank_name,
            'check_no' => $this->check_no,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
