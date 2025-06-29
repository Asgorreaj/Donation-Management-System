import { useCallback, useState } from "react";
import { PaginationInterface, Donation } from "@/helpers/types";
import { fetchDonations } from "@/components/donations/data";
import Swal from 'sweetalert2'; // sweetalert2 imported

const INITIAL_PAGINATION: PaginationInterface = {
  currentPage: 1,
  currentUri: {},
  hasMore: false,
  next: "",
  pageCount: 0,
  pageSelector: "",
  perPage: 25,
  previous: "",
  segment: 0,
  total: 0,
  uri: {},
};

const ERROR_MESSAGES = {
  fetchError: "Error fetching donations. Please try again.",
};

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [pagination, setPagination] = useState<PaginationInterface>(INITIAL_PAGINATION);
  const [loading, setLoading] = useState<"idle" | "loading">("idle");

const fetchData = useCallback(async (params: any) => {
  setLoading("loading");
  try {
    const response = await fetchDonations(params);
    console.log("Fetched data:", response); // Check the response structure
    setDonations(response.data);
    setPagination(response.pagination);
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: ERROR_MESSAGES.fetchError,
    });
  } finally {
    setLoading("idle");
  }
}, []);


  return { donations, pagination, loading, fetchData, setPagination };
};
