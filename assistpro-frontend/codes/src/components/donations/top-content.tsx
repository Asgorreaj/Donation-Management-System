import React, {Dispatch, SetStateAction} from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
  DateValue,
  Input,
  RangeValue,
} from "@nextui-org/react";
import {Branch, PaginationInterface} from "@/helpers/types";
import {SearchIcon} from "@nextui-org/shared-icons";
import {PlusIcon} from "@/components/icons/plus-icon";
import {PaginationSummary} from "@/components/general/pagination-summery";

// Constants
const PLACEHOLDERS = {
  search: "Search by name, code",
};

export const TopContent = ({
                             searchFilter,
                             onClear,
                             handleSearchChange,
                             dateRange,
                             setDateRange,
                             pagination,
                             onRowsPerPageChange,
                             handleAddDonation,
                             branchOptions,
                             branchFilter,
                             setBranchFilter,
                             showBranchFilter
                           }: {
  searchFilter: string;
  onClear: () => void;
  handleSearchChange: (value: string) => void;
  dateRange: RangeValue<DateValue> | null;
  setDateRange: Dispatch<SetStateAction<RangeValue<DateValue> | null>>;
  pagination: PaginationInterface;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAddDonation: () => void;
  branchOptions: Branch[];
  branchFilter: number;
  setBranchFilter: (value: number) => void;
  showBranchFilter: boolean;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        isClearable
        className="w-full sm:max-w-[25%]"
        placeholder={PLACEHOLDERS.search}
        startContent={<SearchIcon/>}
        value={searchFilter}
        onClear={onClear}
        onValueChange={handleSearchChange}
      />
      {showBranchFilter && <Autocomplete
          defaultItems={branchOptions}
          placeholder="Select a branch"
          selectedKey={branchFilter}
          onSelectionChange={(value) => setBranchFilter(value as number)}
          className="w-full sm:max-w-[25%]"
      >
        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
      </Autocomplete>}
      <DateRangePicker
        visibleMonths={2}
        value={dateRange}
        onChange={setDateRange}
        className="w-full sm:max-w-[30%]"
      />
      <Button
        onPress={handleAddDonation}
        color="primary"
        endContent={<PlusIcon/>}
      >
        Add New
      </Button>
    </div>
    <PaginationSummary
      totalItems={pagination.total}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </div>
);
