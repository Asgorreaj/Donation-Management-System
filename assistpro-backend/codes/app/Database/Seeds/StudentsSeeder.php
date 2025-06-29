<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class StudentsSeeder extends Seeder
{
        public function run()
    {
        $students = [
            [
                'code' => 'STU001',
                'name' => 'Abdullah Al Reaj',
                'father_name' => 'Md. Ruhul Amin',
                'mother_name' => 'Nargis Begum',
                'gender' => 'Male',
                'address_present' => '123 Dhaka',
                'address_permanent' => '123 Rajshahi',
                'nid' => '123456789',
                'institution' => 'Dhaka University',
                'year' => 2025,
                'status' => 'Active',
                'branch_id' => 1,
            ],
            // add more dummy entries if needed
        ];

        $this->db->table('students')->insertBatch($students);
    }

}
