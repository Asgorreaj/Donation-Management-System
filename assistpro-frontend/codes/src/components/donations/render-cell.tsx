import {Chip, Tooltip} from "@nextui-org/react";
import React from "react";
;
import {Donation, PaginationInterface} from "@/helpers/types";
import {EyeIcon} from "@/components/icons/table/eye-icon";
import {DeleteIcon} from "../icons/table/delete-icon";
import {EditIcon} from "../icons/table/edit-icon"
import {capitalizeFirstLetter} from "@/helpers/miscellaneous";
import moment from "moment";

interface Props {
  donation: Donation;
  columnKey: string | React.Key;
  setModalState: (state: { isViewModalOpen?: boolean; isFormModalOpen?: boolean; isDeleteModalOpen?: boolean }) => void;
  setSelectedDonation: (id: number) => void;
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
                             donation,
                             columnKey,
                             setModalState,
                             setSelectedDonation,
                             pagination,
                             index
                           }: Props) => {
  // @ts-ignore
  const cellContent = donation[columnKey];

  switch (columnKey) {
    case "sl":
      // Calculate serial number
      const serialNumber =
        (pagination.currentPage - 1) * pagination.perPage + index + 1;
      return <div>{serialNumber}</div>;

    case "name":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{donation?.student?.name}</p>
          <p className="text-bold text-tiny capitalize text-default-400">{donation?.student?.code}</p>
        </div>
      );

    case "date":
      return <div>{moment(cellContent).format('D MMM, YYYY')}</div>;

    case "amount":
      return <div>{cellContent}</div>;

    case "mode_of_payment":
      return <div>{capitalizeFirstLetter(cellContent)}</div>;

    case "actions":
      const handleSetSelectedDonation = (actionState: Partial<Props["setModalState"]>) => {
        setSelectedDonation(donation.id);
        setModalState(actionState);
      };

      return (
        <div className="relative flex justify-end items-center gap-2">
          <ActionButton
            tooltipContent="View Details"
            onClick={() => handleSetSelectedDonation({ isViewModalOpen: true })}
            icon={<EyeIcon size={20} fill="#979797" />}
          />
          <ActionButton
            tooltipContent="Edit Donation"
            onClick={() => handleSetSelectedDonation({ isFormModalOpen: true })}
            icon={<EditIcon size={20} fill="#979797" />}
            color="secondary"
          />
          <ActionButton
            tooltipContent="Delete Donation"
            onClick={() => handleSetSelectedDonation({ isDeleteModalOpen: true })}
            icon={<DeleteIcon size={20} fill="#FF0080" />}
            color="danger"
          />
        </div>
      );

    default:
      return <>{cellContent}</>;
  }
};
