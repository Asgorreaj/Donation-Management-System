import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { Student } from "@/types/reportTypes";

interface ReportMeta {
  organization: string;
  branchName: string;
  reportDate: string;
  title: string;
}

export const generateDonationReportPDF = (students: Student[], meta: ReportMeta) => {
  const doc = new jsPDF("l", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Set light professional background color
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.setFont("bold");
  doc.text(meta.organization || "", 40, 40);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont("normal");
  doc.text(`Branch: ${meta.branchName || ""}`, 40, 60);
  doc.text(`Report Date: ${meta.reportDate || ""}`, pageWidth - 40, 60, { align: "right" });

  // Underline blue line
  doc.setDrawColor(70, 130, 180);
  doc.setLineWidth(1.5);
  doc.line(40, 70, pageWidth - 40, 70);

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 70, 120);
  doc.setFont("bold");
  doc.text(meta.title || "", pageWidth / 2, 95, { align: "center" });

  // Table Header - ID column removed
  const head: RowInput[] = [
    [
      { content: "S/N", rowSpan: 2, styles: { halign: "center", valign: "middle", fontStyle: "bold", fillColor: [70, 130, 180], textColor: 255 } },
      { content: "Members", colSpan: 5, styles: { halign: "center", fontStyle: "bold", fillColor: [70, 130, 180], textColor: 255 } },
      { content: "Amount", colSpan: 4, styles: { halign: "center", fontStyle: "bold", fillColor: [173, 216, 230], textColor: 0 } },
      { content: "Transfered", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [173, 216, 230], textColor: 0 } },
    ],
    [
      // Removed "ID" column
      "Code",
      "Name",
      "Father's Name",
      "Gender",
      "Present Address",
      "Class",
      "Date",
      "Amount",
      "Mode of Payment",
      "Bank Name",
      "Check No",
    ],
  ];

  const body: RowInput[] = [];
  let grandTotal = 0;
  let totalMembers = 0;

  students.forEach((student, index) => {
    const donations = student.donations && student.donations.length > 0 ? student.donations : null;
    totalMembers++;

    if (!donations) {
      body.push([
        (index + 1).toString(),
        // Removed student.id.toString()
        student.code,
        student.name,
        student.father_name,
        student.gender || "-",
        student.address_present || "-",
        student.year !== undefined ? student.year.toString() : "-",
        "-", 
        "-", 
        "-", 
        "-", 
        "-",
      ]);
    } else {
      donations.forEach(donation => {
        grandTotal += donation.amount || 0;
        body.push([
          (index + 1).toString(),
          // Removed student.id.toString()
          student.code,
          student.name,
          student.father_name,
          student.gender || "-",
          student.address_present || "-",
          student.year !== undefined ? student.year.toString() : "-",
          donation.date,
          donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          donation.mode_of_payment,
          donation.bank_name || "-",
          donation.check_no || "-",
        ]);
      });
    }
  });

  // Add Grand Total row
  const totalRow: RowInput = [
    { content: "Grand Total", colSpan: 8, styles: { halign: "right", fontStyle: "bold", fillColor: [220, 230, 240] } },
    { content: grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [220, 230, 240] } },
    "", "", "",
  ];
  body.push(totalRow);

  autoTable(doc, {
    head,
    body,
    startY: 110,
    theme: "grid",
    styles: { 
      fontSize: 9, 
      cellPadding: 5, 
      overflow: "linebreak",
      textColor: [60, 60, 60],
      lineColor: [200, 200, 200],
      lineWidth: 0.3
    },
    headStyles: { 
      fillColor: [70, 130, 180],
      textColor: 255, 
      fontStyle: "bold",
      lineWidth: 0.3
    },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" }, // S/N
      1: { cellWidth: 55 }, // Code
      2: { cellWidth: 60 }, // Name
      3: { cellWidth: 60 }, // Father's Name
      4: { cellWidth: 45 }, // Gender
      5: { cellWidth: 140 }, // Present Address
      6: { cellWidth: 40, halign: "center" }, // Class
      7: { cellWidth: 55, halign: "center" }, // Date
      8: { cellWidth: 75, halign: "right" }, // Amount (increased width)
      9: { cellWidth: 70 }, // Mode of Payment
      10: { cellWidth: 70 }, // Bank Name
      11: { cellWidth: 70, halign: "center" }, // Check No (centered)
    },
    margin: { top: 110, bottom: 120, left: 40, right: 40 },
  });

  // Enhanced Summary Box (without BDT)
  const summaryY = (doc as any).lastAutoTable.finalY + 25;
  
  // Box background with rounded corners
  doc.setFillColor(240, 245, 250);
  doc.setDrawColor(200, 220, 240);
  doc.setLineWidth(0.8);
  doc.roundedRect(40, summaryY, pageWidth - 80, 80, 3, 3, 'FD');
  
  // Inner shadow effect
  doc.setFillColor(230, 235, 240);
  doc.roundedRect(42, summaryY + 2, pageWidth - 80, 80, 3, 3, 'F');
  
  // Divider line
  doc.setDrawColor(210, 225, 240);
  doc.setLineWidth(0.5);
  doc.line(40, summaryY + 40, pageWidth - 40, summaryY + 40);
  
  // Summary content
  doc.setFontSize(12);
  doc.setTextColor(60, 80, 100);
  doc.setFont("bold");
  
  // Left labels
  doc.text("1. Total Members", 60, summaryY + 25);
  doc.text("2. Total Amount", 60, summaryY + 65);
  
  // Right values
  doc.setTextColor(30, 70, 120);
  doc.text(totalMembers.toString(), pageWidth - 60, summaryY + 25, { align: "right" });
  
  doc.setFontSize(13);
  doc.text(grandTotal.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }), pageWidth - 60, summaryY + 65, { align: "right" });

  // Footer
  const footerY = pageHeight - 60;
  doc.setDrawColor(70, 130, 180);
  doc.setLineWidth(0.5);
  doc.line(40, footerY, pageWidth - 40, footerY);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont("normal");
  doc.text("Prepared By:", 40, footerY + 20);
  doc.text("Verified By:", pageWidth / 2 - 50, footerY + 20);
  doc.text("Approved By:", pageWidth - 140, footerY + 20);

  window.open(doc.output('bloburl'), "_blank");
};