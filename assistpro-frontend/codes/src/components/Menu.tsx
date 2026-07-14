"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

type MenuItem = {
  icon: string;
  label: string;
  visible: string[];
  href?: string;
  action?: string;
};

const menuItems: { title: string; items: MenuItem[] }[] = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/admin", visible: ["admin", "donation", "student", "parent"] },
      { icon: "/student.png", label: "Students", href: "/students", visible: ["admin", "donation"] },
      { icon: "/donation2.png", label: "Donations", href: "/donations", visible: ["admin", "donation"] },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { icon: "/reports.png", label: "Reports", href: "/reports", visible: ["admin", "donation"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/logout.png", label: "Logout", action: "logout", visible: ["admin", "donation", "student", "parent"] },
    ],
  },
];

const Menu = () => {
  const params = useParams();
  const pathname = usePathname();
  const mfi = params?.mfi ?? "";

  const isActive = (href: string) => pathname?.startsWith(`/${mfi}${href}`);

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
    <div className="mt-4 text-sm flex flex-col justify-between h-[calc(100vh-80px)]">
      {/* Top Menu Items */}
      <div className="flex flex-col gap-6">
        {menuItems.map((section) => (
          <div className="flex flex-col gap-1" key={section.title}>
            <span className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35 mb-1 px-3">
              {section.title}
            </span>
            {section.items.map((item) => {
              if (!item.visible.includes(role)) return null;

              const isLogout = "action" in item && item.action === "logout";
              const active = "href" in item && item.href ? isActive(item.href) : false;

              const content = (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all ${
                      active ? "bg-gold" : "bg-transparent group-hover:bg-ink/15"
                    }`}
                  />
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isLogout
                        ? "bg-alert/10 group-hover:bg-alert/15"
                        : active
                        ? "bg-gold/15"
                        : "bg-ink/5 group-hover:bg-ink/10"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={16}
                      height={16}
                      className="opacity-80"
                    />
                  </div>
                  <span
                    className={`hidden lg:block text-[13px] font-medium transition-colors ${
                      isLogout
                        ? "text-ink/70 group-hover:text-alert"
                        : active
                        ? "text-ink"
                        : "text-ink/70 group-hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              );

              if (isLogout) {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="group relative flex items-center gap-3 rounded-md px-3 py-2 mx-1 justify-center lg:justify-start hover:bg-alert/10 transition-all"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  href={`/${mfi}${item.href}`}
                  key={item.label}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2 mx-1 justify-center lg:justify-start transition-all ${
                    active ? "bg-gold/10" : "hover:bg-ink/5"
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Animated Section */}
      <div className="mt-auto p-2">
        <div className="relative overflow-hidden rounded-xl bg-gold/5 border border-gold/10 p-3 flex flex-col items-center lg:items-start gap-2 group hover:border-gold/20 transition-all">
          {/* Pulsing Light Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="hidden lg:block text-[11px] font-mono tracking-wider text-gold font-bold uppercase">
              AssistPro Live
            </span>
          </div>
          
          {/* Small Subtext only visible on larger screens */}
          <p className="hidden lg:block text-[11px] text-ink/50 leading-relaxed">
            "Making a difference, one donation at a time."
          </p>
          
          {/* Subtle Background Decorative Shape */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-gold/10 rounded-full blur-md group-hover:bg-gold/15 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default Menu;