import { showSuccessAlert, showErrorAlert, showDeleteConfirmation } from '@/utils/sweetAlert';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { columns, deleteStudent, fetchStudentById } from "@/components/students/data";
import { Branch, PaginationInterface, statusOptions, Student, User } from "@/helpers/types";
import StudentViewModal from "@/components/students/view";
import { Form } from "@/components/students/form";
import { BottomContent } from "@/components/general/bottom-content";
import { useStudents } from "@/components/hooks/useStudents";
import { fetchBranches } from "@/components/general/data";
import { getUserData } from "@/actions/auth.action";
import { TopContent } from "./top-content";
import moment from "moment";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import {EyeIcon} from "@/components/icons/table/eye-icon";
import {DeleteIcon} from "../icons/table/delete-icon";
import {EditIcon} from "../icons/table/edit-icon"

export const TableWrapper = () => {
  const { students, pagination, loading, fetchData, setPagination } = useStudents();
  const [user, setUser] = useState<User | null>(null);
  const [branchOptions, setBranchOptions] = useState<Branch[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<number>(-1);
  const [showBranchFilter, setShowBranchFilter] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | Set<React.Key>>("all");
  const [modalsState, setModalsState] = useState({
    isFormModalOpen: false,
    isViewModalOpen: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);

  const formatCellValue = (value: unknown): React.ReactNode => {
    if (value instanceof Date) {
      return moment(value).format('YYYY-MM-DD');
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  const handleAddStudent = useCallback(() => {
    setSelectedStudent(null);
    setStudentData(null);
    setModalsState(prev => ({...prev, isFormModalOpen: true}));
  }, []);

  const handleEditStudent = useCallback(async (id: number) => {
    setSelectedStudent(id);
    setIsLoadingStudent(true);
    try {
      const response = await fetchStudentById(id);
      setStudentData(response.data);
      setModalsState(prev => ({...prev, isFormModalOpen: true}));
    } catch (error) {
      console.error("Failed to fetch student:", error);
      await showErrorAlert("Failed to load student data");
    } finally {
      setIsLoadingStudent(false);
    }
  }, []);

  const handleViewStudent = useCallback(async (id: number) => {
    setSelectedStudent(id);
    setIsLoadingStudent(true);
    try {
      await fetchStudentById(id);
      setModalsState(prev => ({...prev, isViewModalOpen: true}));
    } catch (error) {
      console.error("Failed to fetch student:", error);
      await showErrorAlert("Failed to load student data");
    } finally {
      setIsLoadingStudent(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirmation();
    
    if (result.isConfirmed) {
      try {
        const response = await deleteStudent(id);
        
        if (response.status === 200) {
          await showSuccessAlert('Student deleted successfully!');
          fetchData({ page: 1, per_page: pagination.perPage });
        } else if (response.status === 400) {
          await showErrorAlert(response.message || 'Cannot delete student with existing donations');
        }
      } catch (error) {
        await showErrorAlert('Failed to delete student');
      }
    }
  };

  const renderCell = useCallback((student: Student, columnKey: React.Key) => {
    const cellValue = student[columnKey as keyof Student];
    const formattedValue = formatCellValue(cellValue);

    switch (columnKey) {
      case "sl":
        const serialNumber = (pagination.currentPage - 1) * pagination.perPage + students.indexOf(student) + 1;
        return <div>{serialNumber}</div>;
      case "actions":
        return (
          
          <div className="flex items-center gap-2 justify-end">
  <Button isIconOnly size="sm" variant="light" onClick={() => handleViewStudent(student.id)}>
    <EyeIcon fill="#4A5568" size={18} />
  </Button>
  <Button isIconOnly size="sm" variant="light" onClick={() => handleEditStudent(student.id)}>
    <EditIcon fill="#4A5568" size={18} />
  </Button>
  <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => handleDelete(student.id)}>
    <DeleteIcon fill="#E53E3E" size={18} />
  </Button>
</div>
        );
      default:
        return formattedValue;
    }
  }, [pagination, students, handleViewStudent, handleEditStudent, isLoadingStudent, selectedStudent]);

  const fetchBranchList = async () => {
    try {
      const response = await fetchBranches();
      const branchOptions = [{ id: -1, name: 'All', code: 'all' }, ...response];
      setBranchOptions(branchOptions);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      await showErrorAlert("Failed to fetch branches");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUser(data);
      if (data && !parseInt(data['is_head_office'] as string)) {
        setBranchFilter(data['default_branch_id']);
        if (data['branch_type'] === 'B') {
          setShowBranchFilter(false);
        }
      }
    };
    fetchUserData();
    fetchBranchList();
  }, []);

  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      per_page: pagination.perPage,
      branch_id: branchFilter,
      search: debouncedSearchFilter,
      status: statusFilter !== "all" ? Array.from(statusFilter).join(",") : null,
    };
    fetchData(params);
  }, [pagination.currentPage, pagination.perPage, debouncedSearchFilter, statusFilter, branchFilter, fetchData]);
  useEffect(() => {
    if (selectedStudent) {
      // Fetch student data for editing when selectedStudent changes
      const fetchStudentData = async () => {
        try {
          const response = await fetchStudentById(selectedStudent);
          console.log("Fetched student data:", response.data);  // Log the fetched data
          setStudentData(response.data);
        } catch (error) {
          console.error("Failed to fetch student:", error);
        }
      };
      fetchStudentData();
    }
  }, [selectedStudent]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearchFilter(searchFilter);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchFilter]);

  const handleStatusChange = useCallback((keys: string | Set<React.Key>) => {
    setPage(1);
    setStatusFilter(keys as "all" | Set<React.Key>);
  }, []);

  const topContent = useMemo(
    () => (
      <TopContent
        searchFilter={searchFilter}
        onClear={() => setSearchFilter("")}
        handleSearchChange={setSearchFilter}
        statusFilter={statusFilter}
        handleStatusChange={handleStatusChange}
        pagination={pagination}
        onRowsPerPageChange={(e) => {
  setPage(1);
  setPagination((prev: PaginationInterface) => ({
    ...prev,
    perPage: Number(e.target.value),
  }));
}}

        handleAddStudent={handleAddStudent}
        branchOptions={branchOptions}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        showBranchFilter={showBranchFilter}
      />
    ),
    [searchFilter, statusFilter, handleStatusChange, pagination, branchOptions, branchFilter, setPagination, handleAddStudent]
  );

      const bottomContent = useMemo(
        () => (
          <BottomContent
            pagination={pagination}
          handlePageChange={(newPage: number) => {
      setPagination((prev: PaginationInterface) => ({ ...prev, currentPage: newPage }));
    }}

      />
    ),
    [pagination]
  );
  
  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        aria-label="Students table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={students}
          loadingContent={<Spinner />}
          loadingState={loading === "loading" ? "loading" : "idle"}
          emptyContent={"No rows to display."}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Form
        key={selectedStudent || 'new'}
        isFormModalOpen={modalsState.isFormModalOpen}
        setFormModalOpen={() => setModalsState(prev => ({...prev, isFormModalOpen: false}))}
        fetchData={() => fetchData({ page })}
        studentId={selectedStudent}
        //studentId={studentData}
      />

      {selectedStudent && (
        <StudentViewModal
          isOpen={modalsState.isViewModalOpen}
          onClose={() => setModalsState(prev => ({...prev, isViewModalOpen: false}))}
          studentId={selectedStudent}
        />
      )}
    </div>
  );
};