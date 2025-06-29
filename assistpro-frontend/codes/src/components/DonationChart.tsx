"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { assistProApiFetch } from "@/helpers/httpClient";

interface DonationData {
  date?: string;
  created_at?: string;
  amount?: string | number;
  donor_id?: string;
}

interface ChartDataPoint {
  name: string;
  donation: number;
}

const DonationChart = () => {
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<"12months" | "5years" | "all">("12months");
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const COLOR = {
    primary: "#4F46E5",
    hover: "#6366F1",
    grid: "#E5E7EB",
    text: "#6B7280",
    background: "#F9FAFB"
  };

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await assistProApiFetch("donations?limit=10000", { method: "GET" });
        const donations: DonationData[] = res.data || [];
        
        const totalAmount = donations.reduce((sum: number, d: DonationData) => {
          return sum + Number(d.amount || 0);
        }, 0);
        setTotal(totalAmount);
        
        let processedData: ChartDataPoint[] = [];
        const now = new Date();
        
        if (timeRange === "12months") {
          processedData = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now);
            date.setFullYear(currentYear);
            date.setMonth(i); // January to December of selected year
            
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear().toString().slice(-2);
            const key = `${month} '${year}`;
            
            const filteredDonations = donations.filter((d: DonationData) => {
              if (!d.date && !d.created_at) return false;
              const donationDate = new Date(d.date || d.created_at || '');
              return (
                donationDate.getMonth() === date.getMonth() && 
                donationDate.getFullYear() === date.getFullYear()
              );
            });
            
            const monthTotal = filteredDonations.reduce((sum: number, d: DonationData) => {
              return sum + Number(d.amount || 0);
            }, 0);
            
            return { name: key, donation: monthTotal };
          });
        } 
        else if (timeRange === "5years") {
          processedData = Array.from({ length: 5 }, (_, i) => {
            const year = now.getFullYear() - (4 - i);
            const key = year.toString();
            
            const filteredDonations = donations.filter((d: DonationData) => {
              if (!d.date && !d.created_at) return false;
              const donationDate = new Date(d.date || d.created_at || '');
              return donationDate.getFullYear() === year;
            });
            
            const yearTotal = filteredDonations.reduce((sum: number, d: DonationData) => {
              return sum + Number(d.amount || 0);
            }, 0);
            
            return { name: key, donation: yearTotal };
          });
        } 
        else {
          const yearMap: Record<string, number> = {};
          
          donations.forEach((d: DonationData) => {
            if (!d.date && !d.created_at) return;
            const donationDate = new Date(d.date || d.created_at || '');
            const year = donationDate.getFullYear().toString();
            yearMap[year] = (yearMap[year] || 0) + Number(d.amount || 0);
          });
          
          processedData = Object.entries(yearMap)
            .map(([name, donation]) => ({ name, donation }))
            .sort((a, b) => parseInt(a.name) - parseInt(b.name));
        }
        
        setChartData(processedData);
      } catch (err) {
        console.error("Failed to load donations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [timeRange, currentYear]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) {
      setCurrentYear(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 h-full shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Donation Analytics</h1>
          <p className="text-sm text-gray-500">Track donation patterns over time</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <p className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</p>
          
          <div className="flex gap-1">
            {timeRange === "12months" && (
              <div className="flex items-center gap-2 mr-2">
                <button 
                  onClick={handlePrevYear}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  &lt;
                </button>
                <span className="text-sm font-medium">{currentYear}</span>
                <button 
                  onClick={handleNextYear}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  disabled={currentYear >= new Date().getFullYear()}
                >
                  &gt;
                </button>
              </div>
            )}
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "12months" | "5years" | "all")}
              className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="12months">Last 12 Months</option>
              <option value="5years">Last 5 Years</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-pulse text-gray-400">Loading donation data...</div>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              barCategoryGap="15%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={COLOR.grid} 
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: COLOR.text, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: COLOR.text, fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  background: "white",
                  padding: "8px 12px"
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Donation"]}
                labelStyle={{ fontWeight: 500, color: COLOR.text, fontSize: 12 }}
                itemStyle={{ color: COLOR.primary, fontSize: 12 }}
              />
              <Bar
                dataKey="donation"
                name="Donations"
                fill={COLOR.primary}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DonationChart;