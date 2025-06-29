"use client";
import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner } from "@nextui-org/react";

export const StudentDonationReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/student-donations');
      const result = await response.json();
      setData(result.data); 
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <Table aria-label="Student Donation Report">
        <TableHeader>
          <TableColumn>STUDENT</TableColumn>
          <TableColumn>CODE</TableColumn>
          <TableColumn>DONATIONS</TableColumn>
          <TableColumn>LAST DONATION</TableColumn>
          <TableColumn>TOTAL AMOUNT</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.student_id}>
              <TableCell>{item.student_name}</TableCell>
              <TableCell>{item.student_code}</TableCell>
              <TableCell>{item.total_donations}</TableCell>
              <TableCell>{item.last_donation_date}</TableCell>
              <TableCell>{item.total_amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};