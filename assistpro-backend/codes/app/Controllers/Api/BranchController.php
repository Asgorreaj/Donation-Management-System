<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class BranchController extends ResourceController
{
    public function allBranchInfo()
    {
        $db = db_connect();
        $branches = $db->table('branches')->get()->getResultArray();

        return $this->respond($branches);
    }
}