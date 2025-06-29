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
import {Student} from "@/helpers/types";
import {fetchStudentById} from "@/components/students/data";
import CustomLoader from "@/components/loaders/CustomLoader";
import moment from "moment/moment";
import { showErrorAlert } from '@/utils/sweetAlert';

interface StudentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
}

interface TableRowItem {
  key: string;
  label: string;
  value: string | number | null | undefined;
}

const COLUMN_DEFINITIONS = [
  {key: "label", label: "Field"},
  {key: "value", label: "Details"},
];

const createRowDefinitions = (studentData: Student): TableRowItem[] => [
  {key: "name", label: "Name", value: studentData.name},
  {key: "code", label: "Code", value: studentData.code},
  {key: "father_name", label: "Father Name", value: studentData.father_name},
  {key: "mother_name", label: "Mother Name", value: studentData.mother_name},
  {key: "gender", label: "Gender", value: studentData.gender},
  {key: "address_present", label: "Present Address", value: studentData.address_present},
  {key: "address_permanent", label: "Permanent Address", value: studentData.address_permanent},
  {key: "nid", label: "National ID", value: studentData.nid},
  {key: "institution", label: "Institution", value: studentData.institution},
  {key: "year", label: "Year", value: studentData.year},
  {key: "status", label: "Status", value: studentData.status},
  {key: "created_at", label: "Created At", value: studentData.created_at
      ? moment(studentData.created_at).format('D MMMM, YYYY h:mm a')
      : ''},
  {key: "updated_at", label: "Updated At", value: studentData.updated_at
      ? moment(studentData.updated_at).format('D MMMM, YYYY h:mm a')
      : ''}
];

const StudentViewModal = ({ isOpen, onClose, studentId }: {
  isOpen: boolean,
  onClose: () => void,
  studentId: number,
}) => {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const loadStudentData = useCallback(async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetchStudentById(id);
      setStudentData(response.data);
    } catch (error) {
      console.error("Failed to fetch student:", error);
      await showErrorAlert("Failed to load student data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentData(studentId);
    }
  }, [isOpen, studentId, loadStudentData]);

  if (!studentData) return null;

  const rows = createRowDefinitions(studentData);

  const renderContent = () => (
    loading ? <CustomLoader/> : (
      <Table aria-label="Student Details" style={{height: "auto", minWidth: "100%"}}>
        <TableHeader columns={COLUMN_DEFINITIONS}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item: TableRowItem) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{
                  item[columnKey as keyof typeof item] || ''
                }</TableCell>
              )}
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
                View Student
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

export default StudentViewModal;