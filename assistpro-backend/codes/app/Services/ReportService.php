<?php
namespace App\Services;

use App\Repositories\ReportRepository;

class ReportService
{
    protected ReportRepository $reportRepository;

    public function __construct()
    {
        $this->reportRepository = new ReportRepository();
    }

    public function getDonationReport(array $filters = []): array
    {
        // Validate date range first
        if (isset($filters['from_date']) && isset($filters['to_date'])) {
            if (strtotime($filters['from_date']) > strtotime($filters['to_date'])) {
                throw new \InvalidArgumentException('from_date must be before to_date');
            }
        }

        return $this->reportRepository->getDonationReport($filters);
    }
}