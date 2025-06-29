<?php

namespace App\DataTransferObjects;

class StudentDTO extends BaseDTO
{
    public function __construct(
        public ?int    $id = null,
        public string  $code,
        public string  $name,
        public string  $father_name,
        public string  $mother_name,
        public string  $gender,
        public ?string $address_present = null,
        public ?string $address_permanent = null,
        public ?string $nid = null,
        public string  $institution,
        public ?int    $year = null,
        public int     $branch_id,
        public ?string $created_at = null,
        public ?string $updated_at = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            code: $data['code'],
            name: $data['name'],
            father_name: $data['father_name'],
            mother_name: $data['mother_name'],
            gender: $data['gender'],
            address_present: $data['address_present'] ?? null,
            address_permanent: $data['address_permanent'] ?? null,
            nid: $data['nid'] ?? null,
            institution: $data['institution'],
            year: $data['year'] ?? null,
            branch_id: $data['branch_id'],
            created_at: $data['created_at'] ?? null,
            updated_at: $data['updated_at'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'father_name' => $this->father_name,
            'mother_name' => $this->mother_name,
            'gender' => $this->gender,
            'address_present' => $this->address_present,
            'address_permanent' => $this->address_permanent,
            'nid' => $this->nid,
            'institution' => $this->institution,
            'year' => $this->year,
            'branch_id' => $this->branch_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
