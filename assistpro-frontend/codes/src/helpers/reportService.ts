// // src/helpers/reportService.ts
// import { assistProApiFetch, apiFetch } from "./httpClient";

// interface DonationReportParams {
//   from_date: string;
//   to_date: string;
//   status?: string;
//   branch_id?: string;
//   type?: string;
// }

// interface DonationReportData {
//   with_donations: any[];
//   without_donations: any[];
// }

// interface DonationReportResponse {
//   status: boolean;
//   message?: string;
//   data: DonationReportData;
// }

// const convertParamsToQueryString = (params: DonationReportParams & { format?: string }): string => {
//   const searchParams = new URLSearchParams();
//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       searchParams.append(key, value.toString());
//     }
//   });
//   return searchParams.toString();
// };

// export const reportService = {
//   getDonationReport: async (params: DonationReportParams): Promise<DonationReportResponse> => {
//     const queryString = convertParamsToQueryString(params);
//     const response = await assistProApiFetch(`report/donations?${queryString}`);

//     if (!response.status) {
//       throw new Error(response.message || "Failed to fetch report");
//     }

//     return {
//       status: response.status,
//       message: response.message,
//       data: {
//         with_donations: response.data?.with_donations || [],
//         without_donations: response.data?.without_donations || [],
//       },
//     };
//   },

//   exportDonationReport: async (
//     params: DonationReportParams & { format?: "pdf" | "excel" }
//   ): Promise<void> => {
//     const queryParams = { ...params, format: params.format || "excel" };
//     const queryString = convertParamsToQueryString(queryParams);

//     // Use apiFetch for blob response
//     const response = await apiFetch(`report/donations/export?${queryString}`, {
//       headers: {
//         Accept:
//           queryParams.format === "pdf"
//             ? "application/pdf"
//             : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "Failed to export report");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `donation-report-${new Date().toISOString()}.${queryParams.format || "xlsx"}`;
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   },
// };

// src/helpers/reportService.ts
import { assistProApiFetch, apiFetch } from "./httpClient";

export interface DonationReportParams {
  from_date: string;
  to_date: string;
  status?: string;
  branch_id?: string;
  type?: string;
  format?: "pdf" | "excel";
}

export interface DonationReportData {
  with_donations: any[];
  without_donations: any[];
}

export interface DonationReportResponse {
  status: boolean;
  message?: string;
  data: DonationReportData;
}

// Helper to build query string, skipping empty values
const convertParamsToQueryString = (params: Partial<DonationReportParams>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const reportService = {
  // Fetch donation report JSON
  getDonationReport: async (
    params: DonationReportParams
  ): Promise<DonationReportResponse> => {
    const queryString = convertParamsToQueryString(params);
    // assistProApiFetch should return parsed JSON with status, message, data
    const response = await assistProApiFetch(`report/donations?${queryString}`);

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch report");
    }

    return {
      status: response.status,
      message: response.message,
      data: {
        with_donations: response.data?.with_donations || [],
        without_donations: response.data?.without_donations || [],
      },
    };
  },

  // Export donation report as file (excel/pdf)
  exportDonationReport: async (
    params: DonationReportParams
  ): Promise<void> => {
    const queryParams = { ...params, format: params.format || "excel" };
    const queryString = convertParamsToQueryString(queryParams);

    const response = await apiFetch(`report/donations/export?${queryString}`, {
      headers: {
        Accept:
          queryParams.format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    if (!response.ok) {
      let errorMsg = "Failed to export report";
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-report-${new Date().toISOString()}.${queryParams.format === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
