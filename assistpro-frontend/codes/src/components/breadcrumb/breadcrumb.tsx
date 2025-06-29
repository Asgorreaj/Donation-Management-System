import React from "react";
import Link from "next/link";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";

const HOME_PATH = "/";
const BREADCRUMB_SEPARATOR = " / ";

interface BreadcrumbProps {
  children: React.ReactNode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ children }) => {
  return (
    <ul className="flex">
      <li className="flex gap-2">
        <HouseIcon />
        <Link href={HOME_PATH}>
          <span>Home</span>
        </Link>
        <span>{BREADCRUMB_SEPARATOR}</span>
      </li>
      {children}
    </ul>
  );
};

export default Breadcrumb;
