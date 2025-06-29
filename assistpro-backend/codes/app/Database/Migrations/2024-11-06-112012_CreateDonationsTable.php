<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDonationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'unsigned'       => true,
                'auto_increment' => true
            ],
            'student_id' => [
                'type'       => 'INT',
                'unsigned'   => true,
                'null'       => false,
                'comment'    => 'Reference to students table'
            ],
            'date' => [
                'type'       => 'DATE',
                'null'       => false,
                'comment'    => 'Date of donation'
            ],
            'amount' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => false,
                'comment'    => 'Donation amount'
            ],
            'mode_of_payment' => [
                'type'       => 'ENUM',
                'constraint' => ['cash', 'bank'],
                'null'       => false,
                'comment'    => 'Mode of payment: cash or bank'
            ],
            'bank_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'comment'    => 'Name of the bank, required if mode of payment is bank'
            ],
            'check_no' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
                'comment'    => 'Check number, required if mode of payment is bank'
            ],
            'created_at' => [
                'type'       => 'DATETIME',
                'null'       => true
            ],
            'updated_at' => [
                'type'       => 'DATETIME',
                'null'       => true
            ]
        ]);

        // Set primary key
        $this->forge->addKey('id', true);

        // Set foreign key
        $this->forge->addForeignKey('student_id', 'students', 'id', 'CASCADE', 'CASCADE');

        // Create table
        $this->forge->createTable('donations');
    }

    public function down()
    {
        $this->forge->dropTable('donations');
    }
}
