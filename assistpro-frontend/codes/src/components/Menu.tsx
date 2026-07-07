"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

const menuItems = [
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
    <div className="mt-4 text-sm flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        {menuItems.map((section) => (
          <div className="flex flex-col gap-1" key={section.title}>
            <span className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.18em] text-paper/35 mb-1 px-3">
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
                      active ? "bg-gold-light" : "bg-transparent group-hover:bg-paper/20"
                    }`}
                  />
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isLogout
                        ? "bg-alert/10 group-hover:bg-alert/25"
                        : active
                        ? "bg-gold/20"
                        : "bg-paper/5 group-hover:bg-paper/10"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={16}
                      height={16}
                      className={`transition-opacity ${active ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`}
                      style={active && !isLogout ? { filter: "sepia(1) saturate(3) hue-rotate(0deg) brightness(1.1)" } : undefined}
                    />
                  </div>
                  <span
                    className={`hidden lg:block text-[13px] font-medium transition-colors ${
                      isLogout
                        ? "text-paper/70 group-hover:text-alert"
                        : active
                        ? "text-gold-light"
                        : "text-paper/70 group-hover:text-paper"
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
                    active ? "bg-paper/[0.07]" : "hover:bg-paper/5"
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;