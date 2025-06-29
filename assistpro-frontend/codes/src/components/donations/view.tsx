// /home/asgor-dev-ai/Documents/Assist Pro/assistpro-frontend/codes/components/donations/view.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {Donation} from "@/helpers/types";
// import {fetchDonationById} from "@/components/donations/data";
import Swal from "sweetalert2";
import CustomLoader from "@/components/loaders/CustomLoader";
import {capitalizeFirstLetter} from "@/helpers/miscellaneous";
import moment from "moment";
import { fetchDonationById } from './data';

const COLUMN_DEFINITIONS = [
  {key: "label", label: "Field"},
  {key: "value", label: "Details"},
];

const createRowDefinitions = (donationData: Donation) => [
  {key: "name", label: "Name", value: donationData?.student?.name},
  {key: "code", label: "Code", value: donationData?.student?.code},
  {key: "date", label: "Date", value: moment(donationData.date).format('D MMM, YYYY')},
  {key: "amount", label: "Amount", value: donationData.amount},
  {key: "mode_of_payment", label: "Mode of Payment", value: donationData.mode_of_payment},
  {key: "bank_name", label: "Bank Name", value: capitalizeFirstLetter(donationData.bank_name)},
  {key: "check_no", label: "Check No", value: donationData.check_no},
  {key: "created_at", label: "Created At", value: donationData.created_at ? moment(donationData.created_at).format('D MMM, YYYY h:mm a') : ''},
  {key: "updated_at", label: "Updated At", value: donationData.updated_at ? moment(donationData.updated_at).format('D MMM, YYYY h:mm a') : ''}
];

const DonationViewModal = ({isOpen, onClose, donationId}: {
  isOpen: boolean,
  onClose: () => void,
  donationId: number,
}) => {
  const [donationData, setDonationData] = useState<Donation>({} as Donation);
  const [loading, setLoading] = useState<boolean>(false);

  const loadDonationData = useCallback(
    async (donationId: number) => {
      setLoading(true);
      try {
        const response = await fetchDonationById(donationId);
        setDonationData(response.data);
      } catch (error: any) {
        console.error("Donation fetch failed:", error.message);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Donation fetch failed. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      loadDonationData(donationId);
    }
  }, [loadDonationData, isOpen, donationId]);

  if (!donationData) return null;

  const rows = createRowDefinitions(donationData);

  const renderContent = () => (
    loading ? <CustomLoader/> : (
      <Table aria-label="Donation Details" style={{height: "auto", minWidth: "100%"}}>
        <TableHeader columns={COLUMN_DEFINITIONS}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{item[columnKey as keyof typeof item]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  );

  return (
    <div>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Donation
              </ModalHeader>
              <ModalBody>{renderContent()}</ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DonationViewModal;