// /home/asgor-dev-ai/Documents/Assist Pro/assistpro-frontend/codes/components/donations/table.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DateValue,
  RangeValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { columns, deleteDonation } from "./data";
import { RenderCell } from "./render-cell";
// import ConfirmDeleteModal from "@/components/modals/confirm-deletion";
import DonationViewModal from "@/components/donations/view";
import { Form } from "@/components/donations/form";
import { BottomContent } from "@/components/general/bottom-content";
import { TopContent } from "@/components/donations/top-content";
import Swal from "sweetalert2";
import { useDonations } from "@/components/hooks/useDonations";
import {parseDate} from "@internationalized/date";
import {fetchStudentOptions} from "@/components/students/data";
import {formatDate} from "@/helpers/miscellaneous";
import {Branch, User} from "@/helpers/types";
import {fetchBranches} from "@/components/general/data";
import {getUserData} from "@/actions/auth.action";
import { ConfirmDeleteModal } from "../modals/confirm-deletion";

const ERROR_MESSAGES = {
  deleteError: "Failed to delete donation. Please try again.",
  fetchSuccess: "Donation deleted successfully.",
};

export const TableWrapper = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const { donations, pagination, loading, fetchData, setPagination } = useDonations();
  const [branchOptions, setBranchOptions] = useState<Branch[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState<string>(searchFilter);
  const [dateRange, setDateRange] = React.useState<RangeValue<DateValue> | null>({
  start: parseDate("1970-01-01"),
   end: parseDate(new Date().toISOString().split('T')[0]),
});

  const [branchFilter, setBranchFilter] = useState<number>(-1);
  const [showBranchFilter, setShowBranchFilter] = useState(true);
  const [studentOptions, setStudentOptions] = useState<{ label: string; key: number }[]>([]);
  const [modalsState, setModalsState] = useState({
    isFormModalOpen: false,
    isViewModalOpen: false,
    isDeleteModalOpen: false,
  });
  const [selectedDonation, setSelectedDonation] = useState<null | number>(null);

  const toggleModal = useCallback(
    (modal: "isFormModalOpen" | "isViewModalOpen" | "isDeleteModalOpen", value: boolean) => {
      setModalsState((prev) => ({
        ...prev,
        [modal]: value,
      }));
    },
    []
  );

  const toggleModalState = (modalState: Partial<typeof modalsState>) => {
    setModalsState((prev) => ({
      ...prev,
      ...modalState,
    }));
  };

  const fetchBranchList = async () => {
    try {
      const response = await fetchBranches();
      const branchOptions = [{ id: -1, name: 'All', code: 'all' }, ...response];
      setBranchOptions(branchOptions);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch branches. Please try again.',
      });
    }
  };

  const fetchStudentsList = async () => {
    try {
      const response = await fetchStudentOptions({});
      setStudentOptions(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch students. Please try again.',
      });
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (selectedDonation !== null) {
      try {
        await deleteDonation(selectedDonation);
        setPage(1);
        fetchData({ page: 1, per_page: pagination.perPage });
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: ERROR_MESSAGES.fetchSuccess,
        });
      } catch (error) {
        console.error("Error deleting donation:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: ERROR_MESSAGES.deleteError,
        });
      } finally {
        toggleModal("isDeleteModalOpen", false);
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearchFilter(searchFilter);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchFilter]);

  useEffect(() => {
    const params = {
      page,
      per_page: pagination.perPage,
      branch_id: branchFilter,
      search: debouncedSearchFilter,
      date_from: formatDate(dateRange?.start),
      date_to: formatDate(dateRange?.end)
    };
    fetchData(params);
  }, [page, pagination.perPage, debouncedSearchFilter, dateRange, fetchData, branchFilter]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUser(data);
      if (user && !parseInt(user['is_head_office'] as string)) {
        setBranchFilter(user['default_branch_id']);
        if (user['branch_type'] == 'B') {
          setShowBranchFilter(false);
        }
      }
    };
    fetchUserData();
    setDateRange({
      start: parseDate("1998-01-01"),
      end: parseDate(new Date().toISOString().split('T')[0]),
    });
    fetchBranchList();
    fetchStudentsList();
  }, []);

  const topContent = useMemo(
    () => (
      <TopContent
        searchFilter={searchFilter}
        onClear={() => setSearchFilter("")}
        handleSearchChange={setSearchFilter}
        pagination={pagination}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onRowsPerPageChange={(e) => {
          setPage(1);
          setPagination((prev) => ({ ...prev, perPage: Number(e.target.value) }));
        }}
        handleAddDonation={() => {
          setSelectedDonation(null);
          toggleModal("isFormModalOpen", true);
        }}
        branchOptions={branchOptions}
        branchFilter={branchFilter}
        setBranchFilter={(value: number) => setBranchFilter(value)}
        showBranchFilter
      />
    ),
    [searchFilter, pagination, dateRange, branchOptions, branchFilter, setPagination, toggleModal]
  );

  const bottomContent = useMemo(
    () => (
      <BottomContent
        pagination={pagination}
        handlePageChange={(page: number) => setPage(page)}
      />
    ),
    [pagination]
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        aria-label="Donations table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={donations}
          loadingContent={<Spinner />}
          loadingState={loading}
          emptyContent={"No rows to display."}
        >
          {(item) => {
            const index = donations.indexOf(item);
            return (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {RenderCell({
                      donation: item,
                      columnKey,
                      setModalState: toggleModalState,
                      setSelectedDonation,
                      pagination,
                      index,
                    })}
                  </TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      <Form
        isFormModalOpen={modalsState.isFormModalOpen}
        setFormModalOpen={() => toggleModal("isFormModalOpen", false)}
        fetchData={() => fetchData({ page })}
        donationId={selectedDonation}
        studentOptions={studentOptions}
      />
      {selectedDonation && (
        <DonationViewModal
          isOpen={modalsState.isViewModalOpen}
          onClose={() => toggleModal("isViewModalOpen", false)}
          donationId={selectedDonation}
        />
      )}
      <ConfirmDeleteModal
        isVisible={modalsState.isDeleteModalOpen}
        onClose={() => toggleModal("isDeleteModalOpen", false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};