// FORMS

import {CalendarDate} from "@nextui-org/react";

export type LoginFormType = {
  username: string;
  password: string;
};
export type StudentFormType = {
  name: string;
  father_name: string;
  mother_name: string;
  gender: "Male" | "Female" | "Other";
  address_present?: string | null;
  address_permanent?: string | null;
  nid?: number | null;
  institution?: string | null;
  year?: number | null;
  status: "Active" | "Inactive";
}
export type DonationFormType = {
  student_id: number | null;
  date: CalendarDate | string;
  amount: number;
  mode_of_payment: "cash" | "bank";
  bank_name?: string;
  check_no?: string;
};

// Models

export interface User {
  id: number;
  login: string;
  full_name: string;
  role_id: number;
  is_super_admin: number | null;
  employee_id: number | null;
  old_user_id: number;
  default_language: string;
  default_branch_id: number;
  current_status: "active" | "inactive" | string;
  email: string;
  theme: string;
  theme_color: string;
  is_support_user: string;
  created_by: number | null;
  created_on: string | null;
  modified_by: number | null;
  modified_on: string | null;
  last_login: string | null;
  last_ip: string | null;
  is_deleted: number;
  deleted_by: number | null;
  deleted_on: string | null;
  last_password_changed: string | null;
  macAddresses: string | null;
  is_first_login: string | null | number;
  mfi_name: string | null;
  branch_name: string | null;
  is_head_office: string | null;
  software_start_date: string | null;
  address: string | null;
  software_date_ais: string | null;
  branch_type: string | null;
  is_islamic_branch: string | null;
  software_date: string | null;
}
export interface Student {
  id: number;
  code: string;
  name: string;
  father_name: string;
  mother_name: string;
  gender: "Male" | "Female" | "Other";
  address_present?: string | null;
  address_permanent?: string | null;
  nid?: string | null;
  institution?: string | null;
  year?: number | null;
  status: "Active" | "Inactive";
  branch_id: number;
  created_at?: Date | null;
  updated_at?: Date | null;

}
export interface Donation {
  id: number;
  student_id: number;
  date: string;
  amount: number;
  mode_of_payment: "cash" | "bank";
  bank_name?: string | null;
  check_no?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  student?: Student | null;
}

// Request

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

// Miscellaneous

export interface PaginationInterface {
  currentPage: number;
  currentUri: object;
  hasMore: boolean;
  next: string;
  pageCount: number;
  pageSelector: string;
  perPage: number;
  previous: string;
  segment: number;
  total: number;
  uri: object;
}

export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Inactive", uid: "inactive"}
];

export interface Branch {
  id: number;
  name: string;
  code: string;
  branch_type: string | null;
  openingDate: string;
  address: string;
  contactNumber: string;
  email: string;
  isActive: number;
  isHeadOffice: number;
}
