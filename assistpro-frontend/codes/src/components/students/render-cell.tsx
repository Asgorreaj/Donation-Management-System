// src/components/students/render-cell.tsx
import { Chip, Tooltip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { PaginationInterface, Student } from "@/helpers/types";

interface Props {
  student: Student;
  columnKey: string | number;
  setModalState: (state: { isViewModalOpen?: boolean; isFormModalOpen?: boolean; isDeleteModalOpen?: boolean }) => void;
  setSelectedStudent: (id: number) => void;
  pagination: PaginationInterface;
  index: number;
}

const ActionButton: React.FC<{
  tooltipContent: string;
  onClick: () => void;
  icon: JSX.Element;
  color?: "success" | "danger" | "default" | "primary" | "secondary" | "warning" | "foreground";
}> = ({ tooltipContent, onClick, icon, color }) => (
  <Tooltip content={tooltipContent} color={color} placement="top">
    <button onClick={onClick}>{icon}</button>
  </Tooltip>
);

export const RenderCell = ({
  student,
  columnKey,
  setModalState,
  setSelectedStudent,
  pagination,
  index
}: Props) => {
  // @ts-ignore
  const cellValue = student[columnKey];

  switch (columnKey) {
    case "sl":
      const serialNumber = (pagination.currentPage - 1) * pagination.perPage + index + 1;
      return <div>{serialNumber}</div>;

    case "name":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{student.name}</p>
          <p className="text-bold text-tiny capitalize text-default-400">{student.code}</p>
        </div>
      );

    case "status":
      return (
        <Chip size="sm" variant="flat" color={cellValue === "Active" ? "success" : "danger"}>
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );

    case "actions":
      const handleSetSelectedStudent = (actionState: Partial<Props["setModalState"]>) => {
        setSelectedStudent(student.id);
        setModalState(actionState);
      };

      return (
        <div className="relative flex justify-end items-center gap-2">
          <ActionButton
            tooltipContent="View Details"
            onClick={() => handleSetSelectedStudent({ isViewModalOpen: true })}
            icon={<EyeIcon size={20} fill="#979797" />}
          />
          <ActionButton
            tooltipContent="Edit Student"
            onClick={() => handleSetSelectedStudent({ isFormModalOpen: true })}
            icon={<EditIcon size={20} fill="#979797" />}
            color="secondary"
          />
          <ActionButton
            tooltipContent="Delete Student"
            onClick={() => handleSetSelectedStudent({ isDeleteModalOpen: true })}
            icon={<DeleteIcon size={20} fill="#FF0080" />}
            color="danger"
          />
        </div>
      );

    default:
      return <>{cellValue}</>;
  }
};