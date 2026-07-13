"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getUserData, deleteAuthCookie } from "@/actions/auth.action";

const Navbar = () => {
  const params = useParams();
  const router = useRouter();
  const mfi = (params?.mfi as string) ?? "";
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserData().then((u: any) => setUsername(u?.username ?? "Account"));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/${mfi}/students?search=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C08829",
      cancelButtonColor: "#B5533C",
      confirmButtonText: "Yes, logout!",
    });
    if (result.isConfirmed) {
      await deleteAuthCookie();
      window.location.href = `/${mfi}/login`;
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-paper-line bg-paper-card px-4 py-3">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="hidden items-center gap-2 rounded-md border border-paper-line bg-paper px-3 py-1.5 text-xs md:flex"
      >
        <Image src="/search.png" alt="" width={13} height={13} className="opacity-50" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students by name…"
          className="w-[220px] bg-transparent text-ink outline-none placeholder:text-ink/40"
        />
      </form>

      {/* PROFILE */}
      <div className="relative ml-auto" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-paper"
        >
          <div className="flex flex-col text-right">
            <span className="text-xs font-medium leading-4 text-ink">{username || "Account"}</span>
            <span className="text-[10px] leading-3 text-ink/40">Administrator</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-xs font-semibold text-gold-light">
            {(username || "A").charAt(0).toUpperCase()}
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-md border border-paper-line bg-paper-card shadow-lg">
            <div className="border-b border-paper-line px-4 py-3">
              <p className="text-sm font-medium text-ink">{username || "Account"}</p>
              <p className="text-[11px] text-ink/40">Signed in</p>
            </div>
            {/* <Link
              href={`/${mfi}/account-settings`}
              className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-paper"
              onClick={() => setOpen(false)}
            >
              Account settings
            </Link> */}
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2.5 text-left text-sm text-alert hover:bg-alert/10"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;