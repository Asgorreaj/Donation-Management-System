// src/components/reports/reportUtils.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const generateStudentDonationReport = async (
  format: "pdf" | "excel" | "print",
  data: any[]
) => {
  if (!data || data.length === 0) return;

  if (format === "pdf") {
    generatePDFReport(data);
  } else if (format === "excel") {
    generateExcelReport(data);
  } else {
    printReport(data);
  }
};

const generatePDFReport = (data: any[]) => {
  const doc = new jsPDF();

  doc.text("Student Donation Report", 14, 15);

  const tableData = data.map((item) => [
    item.student_name,
    item.student_code,
    item.total_donations,
    item.last_donation_date,
    item.total_amount,
  ]);

  autoTable(doc, {
    head: [["Student Name", "Code", "Donations", "Last Donation", "Total Amount"]],
    body: tableData,
    startY: 20,
  });

  doc.save("student_donations_report.pdf");
};

const generateExcelReport = (data: any[]) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      "Student Name": item.student_name,
      Code: item.student_code,
      Donations: item.total_donations,
      "Last Donation": item.last_donation_date,
      "Total Amount": item.total_amount,
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Student Donations");

  XLSX.writeFile(wb, "student_donations_report.xlsx");
};

const printReport = (data: any[]) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    const html = `
      <html>
        <head>
          <title>Student Donation Report</title>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Student Donation Report</h1>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Code</th>
                <th>Donations</th>
                <th>Last Donation</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (item) => `
                <tr>
                  <td>${item.student_name}</td>
                  <td>${item.student_code}</td>
                  <td>${item.total_donations}</td>
                  <td>${item.last_donation_date}</td>
                  <td>${item.total_amount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
