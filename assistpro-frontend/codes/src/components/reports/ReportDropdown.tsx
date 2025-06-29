import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Download, Printer } from "lucide-react";
import { generateStudentDonationReport } from "./reportUtils";

export const ReportDropdown = ({ reportData }: { reportData: any[] }) => {
  const handleGenerateReport = async (format: "pdf" | "excel" | "print") => {
    try {
      await generateStudentDonationReport(format, reportData);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" color="primary" startContent={<Download />}>
          Export
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Report Actions">
        <DropdownItem key="pdf" onClick={() => handleGenerateReport("pdf")}>
          PDF
        </DropdownItem>
        <DropdownItem key="excel" onClick={() => handleGenerateReport("excel")}>
          Excel
        </DropdownItem>
        <DropdownItem key="print" startContent={<Printer />} onClick={() => handleGenerateReport("print")}>
          Print
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
