import DonationChart from "@/components/DonationChart";
import CountChart from "@/components/CountChart";

const AdminPage = () => {
  return (
    <div className="h-full w-full p-6 bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* COUNT CHART */}
        <div className="w-full lg:w-1/3 h-full bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistics</h2>
          <div className="h-full">
            <CountChart />
          </div>
        </div>

        {/* DONATION CHART */}
        <div className="w-full lg:w-2/3 h-full bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Donations Overview</h2>
          <div className="h-full">
            <DonationChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
