"use client";
import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { assistProApiFetch } from "@/helpers/httpClient";

const CountChart = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [sponsoredCount, setSponsoredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = {
    students: "#14342B",   // ink
    sponsored: "#C08829",  // gold
    background: "#E4DCC8", // paper-line
  };

  useEffect(() => {
    async function fetchCounts() {
      try {
        setIsLoading(true);
        const resStudents = await assistProApiFetch("students/all?limit=10000", { method: "GET" });
        const resDonations = await assistProApiFetch("donations?limit=10000", { method: "GET" });

        const students = resStudents.data || [];
        const donations = resDonations.data || [];
        const sponsoredIds = new Set(donations.map((d: any) => d.student_id));

        setStudentCount(students.length);
        setSponsoredCount(sponsoredIds.size);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const sponsoredPercent = studentCount ? Math.round((sponsoredCount / studentCount) * 100) : 0;

  const data = [
    { name: "Total", value: 100, fill: COLORS.background, opacity: 0.4 },
    { name: "Students", value: studentCount, fill: COLORS.students, opacity: 1 },
    { name: "Sponsored", value: sponsoredCount, fill: COLORS.sponsored, opacity: 1 },
  ];

  return (
    <div className="bg-paper-card rounded-md w-full h-full p-6 border border-paper-line shadow-[0_1px_2px_rgba(20,52,43,0.06)]">
      <h1 className="font-display text-lg font-semibold text-ink">Roll call</h1>
      <p className="text-sm text-ink/50">Students on the books vs. those with at least one gift</p>

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-paper-line rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-paper-line rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={16}
                data={data}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ right: 0, fontSize: "12px", color: "#14342B99" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Enrolled</p>
              <p className="font-mono text-2xl font-semibold text-ink">{studentCount}</p>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.students }} />
                <span className="text-sm font-medium text-ink/70">Students</span>
              </div>
              <p className="font-mono text-xl font-semibold text-ink">{studentCount}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.sponsored }} />
                <span className="text-sm font-medium text-ink/70">Sponsored</span>
              </div>
              <p className="font-mono text-xl font-semibold text-ink">{sponsoredCount}</p>
              <p className="text-xs text-ink/40">{sponsoredPercent}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountChart;