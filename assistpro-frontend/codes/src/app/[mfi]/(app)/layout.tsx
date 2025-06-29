import Menu from "@/components/Menu"; // Import the Menu component
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { Image, Link } from "@nextui-org/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      {/* LEFT SECTION: Menu */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link href="/admin" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Assist Pro</span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT SECTION: Main Content */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
        <Navbar />
        <div className="overflow-y-auto flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
