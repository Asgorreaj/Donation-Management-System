// hooks/useStudents.ts
import { useCallback, useState } from "react";
import { PaginationInterface, Student } from "@/helpers/types";
import { fetchStudents } from "@/components/students/data";

type LoadingState = "idle" | "loading" | "loadingMore" | "filtering" | "error" | "sorting";

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
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInterface>(INITIAL_PAGINATION);
  const [loading, setLoading] = useState<LoadingState>("idle");

  const fetchData = useCallback(async (params: any) => {
    setLoading("loading");
    try {
      const response = await fetchStudents(params);
      setStudents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setLoading("error");
    } finally {
      setLoading("idle");
    }
  }, []);

  const refetchWithPage = async (newPage: number, params?: any) => {
    await fetchData({ ...params, page: newPage });
  };

  return { students, pagination, loading, fetchData, setPagination, refetchWithPage };
};
