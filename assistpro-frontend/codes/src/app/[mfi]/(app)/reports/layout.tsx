export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold ">Reports</h2>
      {children}
    </div>
  );
}
