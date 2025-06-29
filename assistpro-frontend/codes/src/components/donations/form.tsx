// /home/asgor-dev-ai/Documents/Assist Pro/assistpro-frontend/codes/components/donations/form.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  DatePicker,
  Autocomplete,
  AutocompleteItem, DateValue
} from "@nextui-org/react";
import { Formik, FormikHelpers } from "formik";
import Swal from "sweetalert2";
import { DonationFormType } from "@/helpers/types";
import { DonationSchema } from "@/helpers/schemas";
import { createDonation, fetchDonationById, updateDonation } from "@/components/donations/data";
import { Radio, RadioGroup } from "@nextui-org/radio";
import {parseDate} from "@internationalized/date";
import {formatDate} from "@/helpers/miscellaneous";

const getEmptyDonationValues = (): DonationFormType => ({
  student_id: null,
  date: parseDate('1970-01-01'),
  amount: 0,
  mode_of_payment: "cash",
  bank_name: '',
  check_no: '',
});

export const Form = ({ isFormModalOpen, setFormModalOpen, fetchData, donationId, studentOptions }: {
  isFormModalOpen: boolean;
  setFormModalOpen: () => void;
  fetchData: () => void;
  donationId: number | null;
  studentOptions: { label: string; key: number; }[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialValues, setInitialValues] = useState<DonationFormType>(getEmptyDonationValues());

  useEffect(() => {
    const fetchDonation = async () => {
      if (donationId) {
        try {
          const response = await fetchDonationById(donationId);
          const {
            student_id,
            date,
            amount,
            mode_of_payment,
            bank_name,
            check_no
          } = response.data;

          setInitialValues({
            student_id,
            date: parseDate(date as string),
            amount,
            mode_of_payment,
            bank_name,
            check_no
          });
        } catch (error) {
          console.error("Failed to fetch donation:", error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch donation details',
          });
        }
      } else {
        setInitialValues({
          ...getEmptyDonationValues(),
          date: parseDate(new Date().toISOString().split('T')[0])}
        );
      }
    };

    if (isFormModalOpen) {
      fetchDonation().then(() => onOpen());
    }
  }, [isFormModalOpen, onOpen, donationId]);

  const toggleModal = useCallback(() => {
    setFormModalOpen();
    onClose();
  }, [setFormModalOpen, onClose]);

  const handleSubmit = useCallback(
    async (values: DonationFormType, { setErrors }: FormikHelpers<DonationFormType>) => {
      try {
        const transformedValues: DonationFormType = {
          ...values,
          date: formatDate(values.date),
          bank_name: values.bank_name || '',
          check_no: values.check_no || '',
        };

        const response = donationId
          ? await updateDonation(donationId, transformedValues)
          : await createDonation(transformedValues);

        if (response.status === 400) {
          setErrors(response.messages || {});
          await Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please correct the highlighted errors.',
          });
        } else {
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: donationId ? "Donation updated successfully." : "Donation created successfully.",
          });
          toggleModal();
          fetchData();
        }
      } catch (error) {
        console.error("Operation failed:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Operation failed. Please try again.',
        });
      }
    },
    [fetchData, toggleModal, donationId]
  );

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={toggleModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {donationId ? 'Edit' : 'Add'} Donation
              </ModalHeader>
              <Formik
                initialValues={initialValues}
                validationSchema={DonationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                  <>
                    <ModalBody>
                      {/* Form Fields */}
                      <div className="flex flex-wrap gap-4">
                        <Autocomplete
                          isRequired
                          label="Student"
                          placeholder="Select a student"
                          defaultItems={studentOptions}
                          selectedKey={values.student_id || undefined}
                          onSelectionChange={(key) => {
                            setFieldValue("student_id", key || null);
                          }}
                          isInvalid={!!errors.student_id && !!touched.student_id}
                          errorMessage={errors.student_id}
                          fullWidth
                        >
                          {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                        </Autocomplete>
                        <DatePicker
                          showMonthAndYearPickers
                          label="Date"
                          value={values.date as DateValue}
                          onChange={(value) => setFieldValue("date", value)}
                          isInvalid={!!errors.date && !!touched.date}
                          errorMessage={errors.date ? String(errors.date) : undefined}
                          fullWidth
                        />
                        <Input
                          isRequired
                          variant="bordered"
                          label="Amount"
                          type="number"
                          value={String(values.amount)}
                          isInvalid={!!errors.amount && !!touched.amount}
                          errorMessage={errors.amount}
                          onChange={handleChange("amount")}
                          fullWidth
                        />
                        <RadioGroup
                          label="Mode of Payment"
                          orientation="horizontal"
                          value={values.mode_of_payment}
                          isInvalid={!!errors.mode_of_payment && !!touched.mode_of_payment}
                          errorMessage={errors.mode_of_payment}
                          onChange={handleChange("mode_of_payment")}
                        >
                          <Radio value="cash">Cash</Radio>
                          <Radio value="bank">Bank</Radio>
                        </RadioGroup>
                        {values.mode_of_payment === "bank" && (
                          <>
                            <Input
                              isRequired
                              variant="bordered"
                              label="Bank Name"
                              type="text"
                              value={values.bank_name || ''}
                              isInvalid={!!errors.bank_name && !!touched.bank_name}
                              errorMessage={errors.bank_name}
                              onChange={handleChange("bank_name")}
                              fullWidth
                            />
                            <Input
                              isRequired
                              variant="bordered"
                              label="Check Number"
                              type="text"
                              value={values.check_no || ''}
                              isInvalid={!!errors.check_no && !!touched.check_no}
                              errorMessage={errors.check_no}
                              onChange={handleChange("check_no")}
                              fullWidth
                            />
                          </>
                        )}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={onClose}>Cancel</Button>
                      <Button type="submit" onClick={() => handleSubmit()}>Submit</Button>
                    </ModalFooter>
                  </>
                )}
              </Formik>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};