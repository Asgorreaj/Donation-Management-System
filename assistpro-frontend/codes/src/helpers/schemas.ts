import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const StudentSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(255, "Name must be 255 characters or less"),
  father_name: Yup.string()
    .required("Father's name is required")
    .max(255, "Father's name must be 255 characters or less"),
  mother_name: Yup.string()
    .required("Mother's name is required")
    .max(255, "Mother's name must be 255 characters or less"),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Gender must be 'Male', 'Female', or 'Other'"),
  address_present: Yup.string()
    .max(500, "Present address must be 500 characters or less")
    .nullable(),
  address_permanent: Yup.string()
    .max(500, "Permanent address must be 500 characters or less")
    .nullable(),
  nid: Yup.string()
    .nullable()
    .matches(/^\d+$/, "NID must be digits only")
    .max(20, "NID must be 20 digits or less"),
  institution: Yup.string()
    .required("Institution is required")
    .max(255, "Institution must be 255 characters or less"),
  year: Yup.number()
    .nullable()
    .typeError("Year must be a number"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Active", "Inactive"], "Status must be either 'Active' or 'Inactive'"),
});

export const DonationSchema = Yup.object().shape({
  student_id: Yup.number()
    .required("Student is required")
    .integer("Student must be an integer"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Date must be a valid date"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Amount must be a number")
    .min(0, "Amount must be greater than or equal to 0"),
  mode_of_payment: Yup.string()
    .required("Mode of payment is required")
    .oneOf(["cash", "bank"], "Mode of payment must be either 'cash' or 'bank'"),
  bank_name: Yup.string()
    .nullable()
    .when("mode_of_payment", {
      is: "bank",
      then: (schema) =>
        schema.required("Bank name is required when mode of payment is 'bank'")
        .max(255, "Bank name must be 255 characters or less"),
      otherwise: (schema) => schema.nullable(),
    }),
  check_no: Yup.string()
    .nullable()
    .when("mode_of_payment", {
      is: "bank",
      then: (schema) =>
        schema.required("Check number is required when mode of payment is 'bank'")
        .max(50, "Check number must be 50 characters or less"),
      otherwise: (schema) => schema.nullable(),
    })
});

