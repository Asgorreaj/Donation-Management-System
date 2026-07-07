"use client";

import { useEffect, useState } from "react";
import DonationChart from "@/components/DonationChart";
import CountChart from "@/components/CountChart";
import { assistProApiFetch, coreApiFetch } from "@/helpers/httpClient";

interface Student {
  id: number | string;
  name: string;
  branch_id: number | string;
  created_at?: string;
}

interface Donation {
  id: number | string;
  student_id: number | string;
  date?: string;
  amount: number | string;
  mode_of_payment: "cash" | "bank";
  created_at?: string;
}

interface Branch {
  id: number | string;
  name: string;
}

const AdminPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [studentsRes, donationsRes, branchesRes] = await Promise.allSettled([
        assistProApiFetch("students/all?limit=10000", { method: "GET" }),
        assistProApiFetch("donations?limit=10000", { method: "GET" }),
        coreApiFetch("po_branches/ajax_all_branch_info", { method: "GET" }),
      ]);

      if (studentsRes.status === "fulfilled") setStudents(studentsRes.value.data || []);
      else console.error("Failed to load students:", studentsRes.reason);

      if (donationsRes.status === "fulfilled") setDonations(donationsRes.value.data || []);
      else console.error("Failed to load donations:", donationsRes.reason);

      if (branchesRes.status === "fulfilled") {
        setBranches(Array.isArray(branchesRes.value) ? branchesRes.value : []);
      } else {
        console.error("Failed to load branches:", branchesRes.reason);
      }

      setLoading(false);
    }
    load();
  }, []);

  const branchName = (id: number | string) =>
    branches.find((b) => String(b.id) === String(id))?.name ?? "—";

  const studentName = (id: number | string) =>
    students.find((s) => String(s.id) === String(id))?.name ?? "Unknown";

  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const now = new Date();
  const thisMonthTotal = donations
    .filter((d) => {
      const dt = new Date(d.date || d.created_at || "");
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.date || b.created_at || "").getTime() - new Date(a.date || a.created_at || "").getTime())
    .slice(0, 8);

  const currency = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const stats = [
    { label: "Students on record", value: students.length.toLocaleString(), suffix: "" },
    { label: "Total raised, all time", value: currency(totalRaised), suffix: "৳" },
    { label: "Raised this month", value: currency(thisMonthTotal), suffix: "৳" },
    { label: "Branches reporting", value: branches.length.toLocaleString(), suffix: "" },
  ];

  return (
    <div className="min-h-full w-full bg-paper">
      <div className="px-2 pb-6 pt-1 md:px-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-dim">
          Donation Ledger &middot; {now.toLocaleString("default", { month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">
          The books, at a glance
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Every entry below is pulled straight from the ledger — no rounding, no guesswork.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2 md:grid-cols-4 md:gap-4 md:px-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-md border border-paper-line bg-paper-card p-4 shadow-[0_1px_2px_rgba(20,52,43,0.06)]"
          >
            <span className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-gold via-gold-light to-transparent" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{s.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink md:text-3xl">
              {s.suffix}
              {loading ? "···" : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 px-2 md:flex-row md:px-4">
        <div className="w-full md:w-2/5">
          <CountChart />
        </div>
        <div className="w-full md:w-3/5">
          <DonationChart />
        </div>
      </div>

      <div className="mt-4 px-2 pb-6 md:px-4">
        <div className="overflow-hidden rounded-md border border-paper-line bg-paper-card shadow-[0_1px_2px_rgba(20,52,43,0.06)]">
          <div className="flex items-center justify-between border-b border-paper-line px-5 py-3">
            <h2 className="font-display text-lg font-semibold text-ink">Recent entries</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
              Latest {recentDonations.length} of {donations.length}
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-ink/40">Reading the ledger…</div>
          ) : recentDonations.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink/40">
              No entries yet. The first donation you record will appear here.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-paper-line font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                  <th className="px-5 py-2 font-normal">Student</th>
                  <th className="hidden px-5 py-2 font-normal md:table-cell">Branch</th>
                  <th className="px-5 py-2 font-normal">Mode</th>
                  <th className="px-5 py-2 font-normal">Date</th>
                  <th className="px-5 py-2 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map((d, i) => {
                  const student = students.find((s) => String(s.id) === String(d.student_id));
                  return (
                    <tr
                      key={d.id}
                      className={`border-b border-paper-line/60 last:border-0 ${i % 2 === 1 ? "bg-paper/40" : ""}`}
                    >
                      <td className="px-5 py-3 font-medium text-ink">{studentName(d.student_id)}</td>
                      <td className="hidden px-5 py-3 text-ink/60 md:table-cell">
                        {student ? branchName(student.branch_id) : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                            d.mode_of_payment === "bank" ? "bg-ink/5 text-ink-light" : "bg-gold/10 text-gold-dim"
                          }`}
                        >
                          {d.mode_of_payment}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink/60">
                        {d.date
                          ? new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-semibold text-ink">
                        ৳{currency(Number(d.amount || 0))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;