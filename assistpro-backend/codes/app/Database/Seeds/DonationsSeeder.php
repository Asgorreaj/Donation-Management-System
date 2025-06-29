<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DonationsSeeder extends Seeder
{
    public function run()
    {
        $donations = [
            [
                'student_id'      => 1,
                'date'            => '2025-06-01',
                'amount'          => 500.00,
                'mode_of_payment' => 'cash',
                'bank_name'       => null,
                'check_no'        => null,
            ],
            [
                'student_id'      => 1,
                'date'            => '2025-06-10',
                'amount'          => 1000.00,
                'mode_of_payment' => 'bank',
                'bank_name'       => 'Islami Bank Ltd.',
                'check_no'        => 'CHK456789',
            ],
            [
                'student_id'      => 1,
                'date'            => '2025-06-14',
                'amount'          => 750.00,
                'mode_of_payment' => 'bank',
                'bank_name'       => 'Dutch Bangla Bank',
                'check_no'        => 'DBBL123456',
            ],
        ];

        // Insert all into the 'donations' table
        $this->db->table('donations')->insertBatch($donations);
    }
}
