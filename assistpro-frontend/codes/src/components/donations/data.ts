// import { assistProApiFetch } from "@/helpers/httpClient";
// import {DonationFormType, QueryParams} from "@/helpers/types";
// import {buildQueryString} from "@/helpers/miscellaneous";

// // Define the columns for the table
// export const columns = [
//    { name: "SL", uid: "sl" },
//    { name: "NAME", uid: "name" },
//    { name: "DATE", uid: "date" },
//    { name: "AMOUNT", uid: "amount" },
//    { name: "MODE_OF_PAYMENT", uid: "mode_of_payment" },
//    { name: "ACTIONS", uid: "actions" },
// ];

// // Fetch donations with pagination
// export const fetchDonations = async (params: QueryParams) => {
//    const queryString = buildQueryString(params);
//    const url = `donations?${queryString}`;

//    return await assistProApiFetch(url, { method: "GET" });
// };

// // Create a new donation
// export const createDonation = async (donationData: DonationFormType) => {
//    return await assistProApiFetch(`donations`, {
//       method: "POST",
//       body: JSON.stringify(donationData),
//    });
// };

// // Fetch a single donation's details by ID
// export const fetchDonationById = async (donationId: number) => {
//    return await assistProApiFetch(`donations/${donationId}`, { method: "GET" });
// };

// // Update existing donation
// export const updateDonation = async (donationId: number, donationData: DonationFormType) => {
//    return await assistProApiFetch(`donations/${donationId}`, {
//       method: "PUT",
//       body: JSON.stringify(donationData),
//    });
// };

// // Delete a donation
// export const deleteDonation = async (donationId: number) => {
//    return await assistProApiFetch(`donations/${donationId}`, {
//       method: "DELETE",
//    });
// };


// /home/asgor-dev-ai/Documents/Assist Pro/assistpro-frontend/codes/components/donations/data.ts
import { assistProApiFetch } from "@/helpers/httpClient";
import {DonationFormType, QueryParams} from "@/helpers/types";
import {buildQueryString} from "@/helpers/miscellaneous";
import Swal from "sweetalert2";

// Define the columns for the table
export const columns = [
   { name: "SL", uid: "sl" },
   { name: "NAME", uid: "name" },
   { name: "DATE", uid: "date" },
   { name: "AMOUNT", uid: "amount" },
   { name: "MODE_OF_PAYMENT", uid: "mode_of_payment" },
   { name: "ACTIONS", uid: "actions" },
];

// Fetch donations with pagination
export const fetchDonations = async (params: QueryParams) => {
   const queryString = buildQueryString(params);
   const url = `donations?${queryString}`;

   return await assistProApiFetch(url, { method: "GET" });
};

// Create a new donation
export const createDonation = async (donationData: DonationFormType) => {
   return await assistProApiFetch(`donations`, {
      method: "POST",
      body: JSON.stringify(donationData),
   });
};

// Fetch a single donation's details by ID
export const fetchDonationById = async (donationId: number) => {
   return await assistProApiFetch(`donations/${donationId}`, { method: "GET" });
};

// Update existing donation
export const updateDonation = async (donationId: number, donationData: DonationFormType) => {
   return await assistProApiFetch(`donations/${donationId}`, {
      method: "PUT",
      body: JSON.stringify(donationData),
   });
};

// Delete a donation
export const deleteDonation = async (donationId: number) => {
   return await assistProApiFetch(`donations/${donationId}`, {
      method: "DELETE",
   });
};