import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import { Formik, FormikHelpers } from "formik";
import { StudentFormType } from "@/helpers/types";
import { StudentSchema } from "@/helpers/schemas";
import { createStudent, fetchStudentById, updateStudent } from "@/components/students/data";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";

const getEmptyStudentValues = (): StudentFormType => ({
  name: '',
  father_name: '',
  mother_name: '',
  gender: 'Male',
  address_present: '',
  address_permanent: '',
  nid: null,
  institution: '',
  year: null,
  status: "Active",
});

export const Form = ({
  isFormModalOpen,
  setFormModalOpen,
  fetchData,
  studentId,
}: {
  isFormModalOpen: boolean;
  setFormModalOpen: () => void;
  fetchData: () => void;
  studentId: number | null;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialValues, setInitialValues] = useState<StudentFormType>(getEmptyStudentValues());

  useEffect(() => {
    const fetchStudent = async () => {
      if (studentId) {
        try {
          const response = await fetchStudentById(studentId);
          const {
            name,
            father_name,
            mother_name,
            gender,
            address_present,
            address_permanent,
            nid,
            institution,
            year,
            status,
          } = response.data;

          setInitialValues({
            name,
            father_name,
            mother_name,
            gender,
            address_present,
            address_permanent,
            nid,
            institution,
            year,
            status,
          });
        } catch (error) {
          console.error("Failed to fetch student:", error);
        }
      } else {
        setInitialValues(getEmptyStudentValues());
      }
    };

    if (isFormModalOpen) fetchStudent().then(() => onOpen());
  }, [isFormModalOpen, onOpen, studentId]);

  const toggleModal = useCallback(() => {
    setFormModalOpen();
    onClose();
  }, [setFormModalOpen, onClose]);

  const handleSubmit = useCallback(
    async (values: StudentFormType, { setErrors }: FormikHelpers<StudentFormType>) => {
      try {
        const response = studentId
          ? await updateStudent(studentId, values)
          : await createStudent(values);

        if (response.status === 400) {
          setErrors(response.messages || {});
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please correct the highlighted errors.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: studentId ? "Student updated successfully." : "Student created successfully.",
            text: "The student data has been saved.",
          });
          toggleModal();
          fetchData();
        }
      } catch (error) {
        console.error("Operation failed:", error);
        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text: "There was an error while processing your request. Please try again.",
        });
      }
    },
    [fetchData, toggleModal, studentId]
  );

  return (
    <div>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={toggleModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {studentId ? "Edit" : "Add"} Student
              </ModalHeader>
              <Formik initialValues={initialValues} validationSchema={StudentSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, handleSubmit, setFieldValue, handleBlur }) => (
                  <>
                    <ModalBody>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-1">
                          <Input
                            isRequired
                            variant="bordered"
                            label="Name"
                            type="text"
                            value={values.name}
                            isInvalid={!!errors.name && !!touched.name}
                            errorMessage={errors.name}
                            onChange={handleChange("name")}
                            fullWidth
                          />
                        </div>
                        <div className="flex flex-1">
                          <Input
                            isRequired
                            variant="bordered"
                            label="Father's Name"
                            type="text"
                            value={values.father_name}
                            isInvalid={!!errors.father_name && !!touched.father_name}
                            errorMessage={errors.father_name}
                            onChange={handleChange("father_name")}
                            fullWidth
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-1">
                          <Input
                            isRequired
                            variant="bordered"
                            label="Mother's Name"
                            type="text"
                            value={values.mother_name}
                            isInvalid={!!errors.mother_name && !!touched.mother_name}
                            errorMessage={errors.mother_name}
                            onChange={handleChange("mother_name")}
                            fullWidth
                          />
                        </div>
                        <div className="flex flex-1">
                          <Input
                            variant="bordered"
                            label="NID"
                            type="text"
                            value={values.nid ? values.nid.toString() : ""}
                            isInvalid={!!errors.nid && !!touched.nid}
                            errorMessage={errors.nid}
                            onChange={handleChange("nid")}
                            min="0"
                            fullWidth
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Textarea
                          label="Address Present"
                          variant="bordered"
                          placeholder="Enter your present address"
                          classNames={{
                            input: "resize-y min-h-[40px]",
                          }}
                          value={values.address_present || ""}
                          isInvalid={!!errors.address_present && !!touched.address_present}
                          errorMessage={errors.address_present}
                          onChange={handleChange("address_present")}
                        />
                        <Textarea
                          label="Address Permanent"
                          variant="bordered"
                          placeholder="Enter your permanent address"
                          classNames={{
                            input: "resize-y min-h-[40px]",
                          }}
                          value={values.address_permanent || ""}
                          isInvalid={!!errors.address_permanent && !!touched.address_permanent}
                          errorMessage={errors.address_permanent}
                          onChange={handleChange("address_permanent")}
                        />
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-1">
                          <Input
                            isRequired
                            variant="bordered"
                            label="Institution"
                            type="text"
                            value={values.institution || ""}
                            isInvalid={!!errors.institution && !!touched.institution}
                            errorMessage={errors.institution}
                            onChange={handleChange("institution")}
                            fullWidth
                          />
                        </div>
                        {/* Class (Year) Dropdown */}
                        <div className="flex flex-col max-w-xs">
                          <label
                            htmlFor="year"
                            className="mb-2 font-semibold text-gray-700 dark:text-gray-300"
                          >
                            {/* Class (Year) */}
                          </label>
                          <select
                            id="year"
                            name="year"
                            value={values.year ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFieldValue("year", val === "" ? null : Number(val));
                            }}
                            onBlur={handleBlur}
                            className={`appearance-none bg-white dark:bg-gray-800 border ${
                              errors.year && touched.year
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                          >
                            <option value="" disabled>
                              Select Class
                            </option>
                            {[...Array(12)].map((_, i) => {
                              const classNumber = i + 1;
                              return (
                                <option key={classNumber} value={classNumber}>
                                  Class {classNumber}
                                </option>
                              );
                            })}
                          </select>
                          {errors.year && touched.year && (
                            <p className="text-red-600 text-sm mt-1">{errors.year}</p>
                          )}
                        </div>

                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-1">
                          <RadioGroup
                            label="Select Gender"
                            orientation="horizontal"
                            value={values.gender}
                            isInvalid={!!errors.gender && !!touched.gender}
                            errorMessage={errors.gender}
                            onChange={handleChange("gender")}
                          >
                            <Radio value="Male">Male</Radio>
                            <Radio value="Female">Female</Radio>
                            <Radio value="Other">Other</Radio>
                          </RadioGroup>
                        </div>
                        <div className="flex flex-1">
                          <RadioGroup
                            label="Select Status"
                            orientation="horizontal"
                            value={values.status}
                            isInvalid={!!errors.status && !!touched.status}
                            errorMessage={errors.status}
                            onChange={handleChange("status")}
                          >
                            <Radio value="Active">Active</Radio>
                            <Radio value="Inactive">Inactive</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <Button color="danger" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button color="success" type="submit" onClick={() => handleSubmit()}>
                        Submit
                      </Button>
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
