"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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
  const router = useRouter();
  const params = useParams();
  const mfi = params?.mfi ?? "";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      await deleteAuthCookie();
      window.location.href = "/disa/login";
    }
  };

  return (
    <div className="mt-4 text-sm flex flex-col justify-between h-full">
      <div>
        {menuItems.map((section) => (
          <div className="flex flex-col gap-2" key={section.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">{section.title}</span>
            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                if ("action" in item && item.action === "logout") {
                  return (
                    <button
                      key={item.label}
                      onClick={handleLogout}
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-red-100 hover:text-red-500 transition-all"
                    >
                      <Image src={item.icon} alt="Logout" width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </button>
                  );
                } else if ("href" in item && item.href) {
                  return (
                    <Link
                      href={`/${mfi}${item.href}`}  // <-- prepend mfi here dynamically
                      key={item.label}
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                    >
                      <Image src={item.icon} alt={item.label} width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  );
                }
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
