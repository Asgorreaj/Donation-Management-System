<?php

namespace App\Resources;

class DonationResource extends BaseResource
{
    /**
     * Transform a single donation into a response array.
     *
     * @param mixed $data
     * @return array
     */
    public function toArray(mixed $data): array
    {
        return [
            'id'               => $data['id'],
            'student_id'       => $data['student_id'],
            'date'             => $data['date'],
            'amount'           => $data['amount'],
            'mode_of_payment'  => $data['mode_of_payment'],
            'bank_name'        => $data['bank_name'],
            'check_no'         => $data['check_no'],
            'created_at'         => $data['created_at']
                ? $data['created_at']->toDateTimeString()
                : null,
            'updated_at'         => $data['updated_at']
                ? $data['updated_at']->toDateTimeString()
                : null,
            'student' => array_key_exists('student', $data)
                ? (new StudentResource())->toArray($data['student']->toArray())
                : null
        ];
    }
}
