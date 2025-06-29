import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { Branch, PaginationInterface, statusOptions } from "@/helpers/types";
import { ChevronDownIcon, SearchIcon } from "@nextui-org/shared-icons";
import { PlusIcon } from "@/components/icons/plus-icon";
import { PaginationSummary } from "@/components/general/pagination-summery";

// Constants for placeholders
const PLACEHOLDERS = {
  search: "Search by name, code",
};

export const TopContent = ({
  searchFilter,
  onClear,
  handleSearchChange,
  statusFilter,
  handleStatusChange,
  pagination,
  onRowsPerPageChange,
  handleAddStudent,
  branchOptions,
  branchFilter,
  setBranchFilter,
  showBranchFilter
}: {
  searchFilter: string;
  onClear: () => void;
  handleSearchChange: (value: string) => void;
  statusFilter: "all" | Set<React.Key>;
  handleStatusChange: (keys: string | Set<React.Key>) => void;
  pagination: PaginationInterface;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAddStudent: () => void;
  branchOptions: Branch[];
  branchFilter: number;
  setBranchFilter: (value: number) => void;
  showBranchFilter: boolean;
}) => {
  // Handle clicking the 'Add New' button, which triggers modal open
  const handleAddNewClick = () => {
    handleAddStudent(); // Only opens modal, no submission logic here
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search Input */}
        <Input
          isClearable
          className="w-full sm:max-w-[30%]"
          placeholder={PLACEHOLDERS.search}
          startContent={<SearchIcon />}
          value={searchFilter}
          onClear={onClear}
          onValueChange={handleSearchChange}
        />

        {/* Branch Filter (Conditional rendering based on showBranchFilter flag) */}
        {showBranchFilter && (
          <Autocomplete
            defaultItems={branchOptions}
            placeholder="Select a branch"
            selectedKey={branchFilter}
            onSelectionChange={(value) => setBranchFilter(value as number)}
            className="w-full sm:max-w-[30%]"
          >
            {(item) => (
              <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete>
        )}

        {/* Status Filter Dropdown */}
        <Dropdown className="w-full sm:max-w-[30%]">
          <DropdownTrigger>
            <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Status filter"
            closeOnSelect={false}
            selectionMode="multiple"
            onSelectionChange={handleStatusChange}
          >
            {statusOptions.map((status) => (
              <DropdownItem key={status.uid} className="capitalize">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Add New Student Button */}
        <Button
          onPress={handleAddNewClick} // Trigger Add Student Modal
          color="primary"
          variant="flat"
          size="lg"
          endContent={<PlusIcon />}
        >
          Add New
        </Button>
      </div>

      {/* Pagination Summary Component */}
      <PaginationSummary
        totalItems={pagination.total}
        onRowsPerPageChange={onRowsPerPageChange} // Handle pagination changes
      />
    </div>
  );
};
