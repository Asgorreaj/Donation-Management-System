import { assistProApiFetch } from "@/helpers/httpClient";
import { buildQueryString } from "@/helpers/miscellaneous";
import {QueryParams, StudentFormType} from "@/helpers/types";
// import { buildQueryString } from "../helpers/miscellaneous";
// import {buildQueryString} from "@/helpers/miscellaneous";

// Define the columns for the table
export const columns = [
   { name: "SL", uid: "sl" },
   { name: "NAME", uid: "name" },
   { name: "GENDER", uid: "gender" },
   { name: "INSTITUTION", uid: "institution" },
   { name: "STATUS", uid: "status" }, 
   { name: "ACTIONS", uid: "actions" },
];

// Fetch students with pagination
export const fetchStudents = async (params: QueryParams) => {
   const queryString = buildQueryString(params);
   const url = `students?${queryString}`;

   return await assistProApiFetch(url, { method: "GET" });
};

// Fetch students as options
export const fetchStudentOptions = async (params: QueryParams) => {
   const queryString = buildQueryString(params);
   const url = `students/all?${queryString}`;

   return await assistProApiFetch(url, { method: "GET" });
};

// Create a new student
export const createStudent = async (studentData: StudentFormType) => {
   return await assistProApiFetch(`students`, {
      method: "POST",
      body: JSON.stringify(studentData),
   });
};

// // Fetch a single student's details by ID
// export const fetchStudentById = async (studentId: number) => {
//    return await assistProApiFetch(`students/${studentId}`, { method: "GET" });
// };
export const fetchStudentById = async (studentId: number) => {
   return await assistProApiFetch(`students/${studentId}`, { method: "GET" });
 };
 

// Update existing student
export const updateStudent = async (studentId: number, studentData: StudentFormType) => {
   return await assistProApiFetch(`students/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
   });
};

// // Delete a student
// export const deleteStudent = async (studentId: number) => {
//    return await assistProApiFetch(`students/${studentId}`, {
//       method: "DELETE",
//    });
// };

// Check if student has donations
export const checkStudentDonations = async (studentId: number) => {
   try {
     const response = await assistProApiFetch(`students/${studentId}/donations`, {
       method: "GET"
     });
     return response.data; // Assuming it returns { hasDonations: boolean }
   } catch (error) {
     console.error("Error checking donations:", error);
     throw new Error("Failed to check donations");
   }
 };
 
 
 export const deleteStudent = async (studentId: number) => {
   return await assistProApiFetch(`students/${studentId}`, {
     method: "DELETE",
   });
 };
