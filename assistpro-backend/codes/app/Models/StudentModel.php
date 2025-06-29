<?php

namespace App\Models;

use CodeIgniter\Model;

class StudentModel extends Model
{
    protected $table      = 'students';
    protected $primaryKey = 'id';
    protected $returnType = 'App\Entities\Student';
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $allowedFields = [
        'code', 'name', 'father_name', 'mother_name', 'gender',
        'address_present', 'address_permanent', 'nid', 'institution',
        'year', 'status', 'branch_id', 'created_at', 'updated_at'
    ];
}
