// src/types/reportTypes.ts

export interface Donation {
  date: string;
  amount: number;
  mode_of_payment: string;
  bank_name?: string;
  check_no?: string;
}

export interface Student {
  id: number;
  code: string;
  name: string;
  father_name: string;
  mother_name?: string;
  gender?: string;
  address_present?: string;
  address_permanent?: string;
  nid?: string;
  institution?: string;
  year?: number;
  status?: string;
  branch_id?: number | string;
  donations?: Donation[];
}
