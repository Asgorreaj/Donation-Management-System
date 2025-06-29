import { deleteAuthCookie, getTokenInfo } from "@/actions/auth.action";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import AdminPage from "./admin/page";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokenInfo = await getTokenInfo();
  
  if (!tokenInfo) {
    redirect('/disa/login');
  } 
   // if (!tokenInfo) {
  //   redirect('/auth/login');
  // } 
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/disa/admin"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Assist Pro</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
