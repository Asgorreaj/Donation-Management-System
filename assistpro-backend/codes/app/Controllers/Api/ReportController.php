<?php
namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Services\ReportService;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use TCPDF;

class ReportController extends ResourceController
{
    protected ReportService $reportService;

    public function __construct()
    {
        $this->reportService = new ReportService();
    }

    public function donationReport()
    {
        $fromDate = $this->request->getGet('from_date');
        $toDate = $this->request->getGet('to_date');
        $status = $this->request->getGet('status');
        $branchId = $this->request->getGet('branch_id');
        $type = $this->request->getGet('type');

        // Validate required fields
        if (!$fromDate || !$toDate) {
            return $this->failValidationErrors('from_date and to_date are required');
        }

        try {
            $reportData = $this->reportService->getDonationReport([
                'from_date' => $fromDate,
                'to_date' => $toDate,
                'status' => $status,
                'branch_id' => $branchId,
                'type' => $type,
            ]);

            // Return message if no data found
            if (empty($reportData['with_donations']) && empty($reportData['without_donations'])) {
                return $this->respond([
                    'status' => false,
                    'message' => "No students or donations found between $fromDate and $toDate",
                    'data' => []
                ]);
            }

            return $this->respond([
                'status' => true,
                'message' => 'Report generated successfully',
                'data' => $reportData
            ]);

        } catch (\InvalidArgumentException $e) {
            return $this->failValidationErrors($e->getMessage());
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function exportDonationReport()
    {
        $fromDate = $this->request->getGet('from_date');
        $toDate = $this->request->getGet('to_date');
        $format = $this->request->getGet('format') ?? 'excel';
        $status = $this->request->getGet('status');
        $branchId = $this->request->getGet('branch_id');
        $type = $this->request->getGet('type');

        // Validate required fields
        if (!$fromDate || !$toDate) {
            return $this->failValidationErrors('from_date and to_date are required');
        }

        try {
            $filters = [
                'from_date' => $fromDate,
                'to_date' => $toDate,
                'status' => $status,
                'branch_id' => $branchId,
                'type' => $type,
            ];

            $reportData = $this->reportService->getDonationReport($filters);

            // Check if any data exists
            if (empty($reportData['with_donations']) && empty($reportData['without_donations'])) {
                $message = "No data available to export between $fromDate and $toDate";
                
                if ($format === 'pdf') {
                    $pdf = new TCPDF();
                    $pdf->AddPage();
                    $pdf->SetFont('helvetica', '', 12);
                    $pdf->Write(0, $message);
                    $filename = 'donation-report.pdf';

                    return $this->response->setHeader('Content-Type', 'application/pdf')
                        ->setHeader('Content-Disposition', "attachment;filename=\"$filename\"")
                        ->setBody($pdf->Output($filename, 'S'));
                } else {
                    $spreadsheet = new Spreadsheet();
                    $sheet = $spreadsheet->getActiveSheet();
                    $sheet->setCellValue('A1', $message);
                    $writer = new Xlsx($spreadsheet);
                    $tempFile = tempnam(sys_get_temp_dir(), 'donation_report_') . '.xlsx';
                    $writer->save($tempFile);

                    return $this->response->download($tempFile, null)
                        ->setFileName('donation-report.xlsx')
                        ->setContentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                }
            }

            // Generate export based on format
            if ($format === 'pdf') {
                return $this->generatePdfReport($reportData, $fromDate, $toDate);
            } else {
                return $this->generateExcelReport($reportData);
            }

        } catch (\InvalidArgumentException $e) {
            return $this->failValidationErrors($e->getMessage());
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    protected function generatePdfReport(array $reportData, string $fromDate, string $toDate)
    {
        $pdf = new TCPDF();
        $pdf->AddPage();
        $pdf->SetFont('helvetica', '', 12);

        $html = '<h1>Donation Report</h1>';
        $html .= '<p>Date Range: ' . $fromDate . ' to ' . $toDate . '</p>';
        $html .= '<table border="1" cellpadding="4">
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Code</th><th>Status</th>
                    <th>Donation Date</th><th>Amount</th><th>Payment Mode</th>
                </tr>
            </thead><tbody>';

        foreach ($reportData['with_donations'] as $student) {
            foreach ($student['donations'] as $donation) {
                $html .= '<tr>
                    <td>' . $student['id'] . '</td>
                    <td>' . $student['name'] . '</td>
                    <td>' . $student['code'] . '</td>
                    <td>' . $student['status'] . '</td>
                    <td>' . $donation->date . '</td>
                    <td>' . $donation->amount . '</td>
                    <td>' . $donation->mode_of_payment . '</td>
                </tr>';
            }
        }

        $html .= '</tbody></table>';
        $pdf->writeHTML($html);

        $filename = 'donation-report-' . date('Y-m-d') . '.pdf';
        return $this->response->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', "attachment;filename=\"$filename\"")
            ->setBody($pdf->Output($filename, 'S'));
    }

    protected function generateExcelReport(array $reportData)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $headers = ['ID', 'Name', 'Code', 'Status', 'Donation Date', 'Amount', 'Payment Mode'];
        $sheet->fromArray($headers, null, 'A1');

        // Add data
        $row = 2;
        foreach ($reportData['with_donations'] as $student) {
            foreach ($student['donations'] as $donation) {
                $sheet->setCellValue('A' . $row, $student['id']);
                $sheet->setCellValue('B' . $row, $student['name']);
                $sheet->setCellValue('C' . $row, $student['code']);
                $sheet->setCellValue('D' . $row, $student['status']);
                $sheet->setCellValue('E' . $row, $donation->date);
                $sheet->setCellValue('F' . $row, $donation->amount);
                $sheet->setCellValue('G' . $row, $donation->mode_of_payment);
                $row++;
            }
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'donation_report_') . '.xlsx';
        $writer->save($tempFile);

        $filename = 'donation-report-' . date('Y-m-d') . '.xlsx';
        return $this->response->download($tempFile, null)
            ->setFileName($filename)
            ->setContentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
}