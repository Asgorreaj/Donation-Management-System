<?php

namespace App\Models;

use CodeIgniter\Model;

class Users extends Model
{
    protected $table      = 'users';
    protected $primaryKey = 'id';

    protected $allowedFields = ['username', 'email', 'password'];

    protected $useTimestamps = true; // 👈 Make sure this is present

    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
