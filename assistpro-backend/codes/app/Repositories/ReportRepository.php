<?php
namespace App\Repositories;

use CodeIgniter\Database\BaseBuilder;

class ReportRepository
{
    protected $db;
    protected $studentTable = 'students';
    protected $donationTable = 'donations';

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getDonationReport(array $filters = []): array
    {
        $fromDate = $filters['from_date'] ?? null;
        $toDate = $filters['to_date'] ?? null;
        $status = $filters['status'] ?? null;
        $branchId = $filters['branch_id'] ?? null;
        $type = $filters['type'] ?? null;

        // Base student query
        $studentBuilder = $this->db->table($this->studentTable)->select('*');

        // Apply status filter
        if ($status !== null) {
            $studentBuilder->where('status', $status);
        }

        // Apply branch filter
        if ($branchId !== null) {
            $studentBuilder->where('branch_id', $branchId);
        }

        $students = $studentBuilder->get()->getResult();

        if (empty($students)) {
            return [
                'with_donations' => [],
                'without_donations' => []
            ];
        }

        $studentIds = array_column($students, 'id');

        // Donation query with date range
        $donationBuilder = $this->db->table($this->donationTable)
            ->select('donations.*')
            ->where('date >=', $fromDate)
            ->where('date <=', $toDate)
            ->whereIn('student_id', $studentIds);

        if ($branchId !== null) {
            $donationBuilder->join('students', 'students.id = donations.student_id')
                ->where('students.branch_id', $branchId);
        }

        $donations = $donationBuilder->get()->getResult();

        // Group donations by student_id
        $donationsByStudent = [];
        foreach ($donations as $donation) {
            $donationsByStudent[$donation->student_id][] = $donation;
        }

        // Process students
        $withDonations = [];
        $withoutDonations = [];

        foreach ($students as $student) {
            $studentData = (array) $student;
            $hasDonation = isset($donationsByStudent[$student->id]);

            if ($hasDonation) {
                $studentData['donations'] = $donationsByStudent[$student->id];
                $withDonations[] = $studentData;
            } else {
                $withoutDonations[] = $studentData;
            }
        }

        // Apply type filter
        switch ($type) {
            case 'donation':
                return ['with_donations' => $withDonations, 'without_donations' => []];
            case 'non-donation':
                return ['with_donations' => [], 'without_donations' => $withoutDonations];
            default:
                return [
                    'with_donations' => $withDonations,
                    'without_donations' => $withoutDonations
                ];
        }
    }
}