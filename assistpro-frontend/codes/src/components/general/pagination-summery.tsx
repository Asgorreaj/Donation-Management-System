import React from "react";

// Props for the PaginationSummary component
type PaginationSummaryProps = {
  totalItems: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

// PaginationSummary Component
export const PaginationSummary: React.FC<PaginationSummaryProps> = ({
                                                                      totalItems,
                                                                      onRowsPerPageChange,
                                                                    }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">Total {totalItems} rows</span>
      <label className="flex items-center text-default-400 text-small">
        Rows per page:
        <select
          className="bg-transparent outline-none text-default-400 text-small"
          onChange={onRowsPerPageChange}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
  );
};
