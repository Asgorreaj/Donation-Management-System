"use client";
import React from "react";
import {UsersIcon} from "@/components/icons/breadcrumb/users-icon";
import {TableWrapper} from "@/components/students/table";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

const STUDENTS_PAGE_TITLE = "All Students";

export const Students = () => {
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* <Breadcrumb>
        <li className="flex gap-2">
          <UsersIcon/>
          <span>Students</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </Breadcrumb> */}
      <h3 className="text-xl font-semibold">{STUDENTS_PAGE_TITLE}</h3>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper/>
      </div>
    </div>
  );
};
