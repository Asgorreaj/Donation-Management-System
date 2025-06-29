import React from "react";
import {Pagination} from "@nextui-org/react";
import {PaginationInterface} from "@/helpers/types";

export const BottomContent = ({
                         pagination,
                         handlePageChange,
                       }: {
  pagination: PaginationInterface;
  handlePageChange: (page: number) => void;
}) => {
  if (pagination.total === 0) return null;

  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {`Showing ${(pagination.currentPage - 1) * pagination.perPage + 1} - 
        ${Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of ${pagination.total}`}
      </span>
      <Pagination
        showControls
        total={pagination.pageCount}
        page={pagination.currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};
