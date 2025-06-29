<?php

namespace App\Resources;

class StudentResource extends BaseResource
{
    /**
     * Transform a single student into a response array.
     *
     * @param mixed $data
     * @return array
     */
    public function toArray(mixed $data): array
    {
        return [
            'id'                 => $data['id'],
            'code'               => $data['code'],
            'name'               => $data['name'],
            'father_name'        => $data['father_name'],
            'mother_name'        => $data['mother_name'],
            'gender'             => $data['gender'],
            'address_present'    => $data['address_present'],
            'address_permanent'  => $data['address_permanent'],
            'nid'                => $data['nid'],
            'institution'        => $data['institution'],
            'year'               => $data['year'],
            'branch_id'          => $data['branch_id'],
            'status'             => $data['status'],
            'created_at'         => $data['created_at']
                ? $data['created_at']->toDateTimeString()
                : null,
            'updated_at'         => $data['updated_at']
                ? $data['updated_at']->toDateTimeString()
                : null
        ];
    }
}
