import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-paper">
      {/* LEFT SECTION: Sidebar (the ledger's cover) */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-ink flex flex-col">
        <Link href="/admin" className="flex items-center justify-center gap-2 border-b border-paper/10 px-4 py-5 lg:justify-start">
          <Image src="/logo.png" alt="logo" width={28} height={28} className="rounded-sm" />
          <span className="hidden font-display text-[15px] font-semibold text-paper lg:block">
            Assist<span className="text-gold-light">Pro</span>
          </span>
        </Link>
        <div className="flex-1 px-1 lg:px-3">
          <Menu />
        </div>
        <div className="hidden px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-paper/30 lg:block">
          Ledger v1.0
        </div>
      </div>

      {/* RIGHT SECTION: Main Content (the ledger's pages) */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-paper flex flex-col">
        <Navbar />
        <div className="overflow-y-auto flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}