"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
} from "@nextui-org/react";
import { reportService } from "@/helpers/reportService";
import { Branch } from "@/helpers/types";
import { fetchBranches } from "@/components/general/data";
import { generateDonationReportPDF } from "@/helpers/pdfReportUtils";

type Donation = {
  id: number;
  date: string;
  amount: number;
  mode_of_payment: string;
  bank_name?: string;
  check_no?: string;
};

type Student = {
  id: number;
  code: string;
  name: string;
  father_name: string;
  gender?: string;
  address_present?: string;
  institution?: string;
  year?: number;
  donations?: Donation[];
};

const ReportPage = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branchId, setBranchId] = useState<string>("0");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [withDonations, setWithDonations] = useState<Student[]>([]);
  const [withoutDonations, setWithoutDonations] = useState<Student[]>([]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchesError, setBranchesError] = useState("");

  const loadBranches = async () => {
    setLoadingBranches(true);
    setBranchesError("");
    try {
      const data = await fetchBranches();
      setBranches([
        { id: 0, name: "All", code: "all", branch_type: null, openingDate: "", address: "", contactNumber: "", email: "", isActive: 1, isHeadOffice: 0 },
        ...data,
      ]);
    } catch (e) {
      console.error("Error loading branches:", e);
      setBranchesError("Failed to load branches");
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    setWithDonations([]);
    setWithoutDonations([]);

    if (!fromDate || !toDate) {
      setError("Please select both from and to dates.");
      setLoading(false);
      return;
    }

    try {
      const response = await reportService.getDonationReport({
        from_date: fromDate,
        to_date: toDate,
        status,
        type,
        branch_id: branchId && branchId !== "0" ? branchId : undefined,
      });

      setWithDonations(response.data.with_donations || []);
      setWithoutDonations(response.data.without_donations || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch report");
    }

    setLoading(false);
  };

  const generatePDF = () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates to generate PDF.");
      return;
    }

    const mappedStudents = (type === "non-donation" ? withoutDonations : withDonations).map((student) => ({
      id: student.id,
      code: student.code,
      name: student.name,
      father_name: student.father_name,
      gender: student.gender || "-",
      address_present: student.address_present || "-",
      institution: student.institution || "-",
      year: student.year || 0,
      donations: (student.donations || []).map((don) => ({
        date: don.date,
        amount: Number(don.amount),
        mode_of_payment: don.mode_of_payment,
        bank_name: don.bank_name || "-",
        check_no: don.check_no || "-",
      })),
    }));

    const meta = {
      organization: "Assist Pro",
      branchName: branches.find((b) => b.id.toString() === branchId)?.name || "All",
      reportDate: `${fromDate} - ${toDate}`,
      title: type === "non-donation" ? "Non Donation Report" : "Donation Report",
    };

    generateDonationReportPDF(mappedStudents, meta);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* <h1 className="text-3xl font-extrabold mb-8 text-blue-700">Donation Reports</h1> */}

      <Card className="p-6 mb-8 shadow-lg rounded-lg border border-gray-300">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col w-48">
            <label className="mb-1 font-semibold text-gray-700">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-48">
            <label className="mb-1 font-semibold text-gray-700">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-48">
            <label className="mb-1 font-semibold text-gray-700">Branch</label>
            {loadingBranches ? (
              <Spinner size="sm" />
            ) : branchesError ? (
              <span className="text-red-600">{branchesError}</span>
            ) : (
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col w-48">
            <label className="mb-1 font-semibold text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="donation">Donation</option>
              <option value="non-donation">Non Donation</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              onClick={fetchReport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {loading ? "Loading..." : "Show Report"}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={
                loading ||
                ((type === "donation" && withDonations.length === 0) ||
                  (type === "non-donation" && withoutDonations.length === 0))
              }
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <Spinner />}

      {!loading && !error && withDonations.length === 0 && withoutDonations.length === 0 && (
        <div className="text-center text-gray-600 mt-8">No data found for selected filters.</div>
      )}

      {(type === "" || type === "donation") && withDonations.length > 0 && (
        <Card className="mb-10 p-6 shadow-md border border-gray-200 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6 text-blue-800">Students with Donations</h3>
          <Table aria-label="Students with donations" isStriped isHeaderSticky>
            <TableHeader>
              <TableColumn>SL</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Fathers Name</TableColumn>
              <TableColumn>Gender</TableColumn>
              <TableColumn>Present Address</TableColumn>
              <TableColumn>Institution</TableColumn>
              <TableColumn>Year</TableColumn>
              <TableColumn>Donation Date(s)</TableColumn>
              <TableColumn>Amount(s)</TableColumn>
              <TableColumn>Payment Mode(s)</TableColumn>
            </TableHeader>
            <TableBody>
              {withDonations.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {student.name}
                    <div className="text-sm text-gray-500">({student.code})</div>
                  </TableCell>
                  <TableCell>{student.father_name}</TableCell>
                  <TableCell>{student.gender || "-"}</TableCell>
                  <TableCell>{student.address_present || "-"}</TableCell>
                  <TableCell>{student.institution || "-"}</TableCell>
                  <TableCell>{student.year || "-"}</TableCell>
                  <TableCell>{student.donations?.map((d) => d.date).join(", ")}</TableCell>
                  <TableCell>{student.donations?.map((d) => d.amount).join(", ")}</TableCell>
                  <TableCell>{student.donations?.map((d) => d.mode_of_payment).join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {(type === "" || type === "non-donation") && withoutDonations.length > 0 && (
        <Card className="mb-10 p-6 shadow-md border border-gray-200 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6 text-blue-800">Students without Donations</h3>
          <Table aria-label="Students without donations" isStriped isHeaderSticky>
            <TableHeader>
              <TableColumn>SL</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Fathers Name</TableColumn>
              <TableColumn>Gender</TableColumn>
              <TableColumn>Present Address</TableColumn>
              <TableColumn>Institution</TableColumn>
              <TableColumn>Year</TableColumn>
            </TableHeader>
            <TableBody>
              {withoutDonations.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {student.name}
                    <div className="text-sm text-gray-500">({student.code})</div>
                  </TableCell>
                  <TableCell>{student.father_name}</TableCell>
                  <TableCell>{student.gender || "-"}</TableCell>
                  <TableCell>{student.address_present || "-"}</TableCell>
                  <TableCell>{student.institution || "-"}</TableCell>
                  <TableCell>{student.year || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default ReportPage;
