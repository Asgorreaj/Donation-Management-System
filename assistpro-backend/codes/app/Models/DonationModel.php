<?php

namespace App\Models;

use CodeIgniter\Model;

class DonationModel extends Model
{
    protected $table = 'donations';
    protected $primaryKey = 'id';
    protected $returnType = 'App\Entities\Donation';
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $allowedFields = [
        'student_id', 'date', 'amount', 'mode_of_payment',
        'bank_name', 'check_no', 'created_at', 'updated_at'
    ];
}
