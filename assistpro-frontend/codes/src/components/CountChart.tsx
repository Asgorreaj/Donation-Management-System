"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { assistProApiFetch } from "@/helpers/httpClient";

const CountChart = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = {
    students: "#4F46E5",  // Indigo-600
    donors: "#10B981",    // Emerald-500
    background: "#F3F4F6" // Gray-100
  };

  useEffect(() => {
    async function fetchCounts() {
      try {
        setIsLoading(true);
        const resStudents = await assistProApiFetch("students/all?limit=10000", { method: "GET" });
        const resDonations = await assistProApiFetch("donations?limit=10000", { method: "GET" });
        
        const students = resStudents.data || [];
        const donations = resDonations.data || [];
        const donorIds = new Set(donations.map((d: any) => d.donor_id));
        
        setStudentCount(students.length);
        setDonorCount(donorIds.size);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const total = studentCount + donorCount;
  const studentPercent = total ? Math.round((studentCount / total) * 100) : 0;
  const donorPercent = total ? Math.round((donorCount / total) * 100) : 0;

  const data = [
    { 
      name: "Total", 
      value: 100, 
      fill: COLORS.background,
      opacity: 0.3 
    },
    { 
      name: "Students", 
      value: studentCount, 
      fill: COLORS.students,
      opacity: 1 
    },
    { 
      name: "Donors", 
      value: donorCount, 
      fill: COLORS.donors,
      opacity: 1 
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Community Overview</h1>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {/* <Image src="/icons/more-vertical.svg" alt="More options" width={20} height={20} /> */}
        </button>
      </div>
      
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
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
                <RadialBar 
                  background 
                  dataKey="value" 
                  cornerRadius={8}
                />
                <Legend 
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    right: 0,
                    fontSize: '12px',
                    color: '#6B7280'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.students }} />
                <span className="text-sm font-medium text-gray-700">Students</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{studentCount}</p>
              <p className="text-xs text-gray-500">{studentPercent}%</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.donors }} />
                <span className="text-sm font-medium text-gray-700">Donors</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{donorCount}</p>
              <p className="text-xs text-gray-500">{donorPercent}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountChart;