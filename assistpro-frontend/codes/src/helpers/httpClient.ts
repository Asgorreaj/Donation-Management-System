// src/helpers/httpClient.ts
import { createAuthCookie, getTokenInfo, getUserData } from "@/actions/auth.action";

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!;
const CORE_SERVICE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_URL!;
const ASSIST_PRO_SERVICE_URL = process.env.NEXT_PUBLIC_ASSIST_PRO_SERVICE_URL!;
const JSON_CONTENT_TYPE = "application/json";

const FORM_HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };
const AUTH_HEADERS = { "Content-Type": JSON_CONTENT_TYPE };

const createTokenInfo = (data: any) => ({
  access_token: data?.access_token,
  expires_in: data?.expires_in,
  expires_at: data?.expires_in + Date.now(),
  refresh_expires_in: data?.refresh_expires_in,
  refresh_expires_at: data?.refresh_expires_in + Date.now(),
  refresh_token: data?.refresh_token,
  scope: data?.scope,
  token_type: data?.token_type,
});

const populateUserBranchInfo = (user: any, branchData: any) => {
  const branchInfo = branchData["branch-info"];
  user.branch_name = branchInfo.name;
  user.is_head_office = branchInfo.is_head_office;
  user.software_start_date = branchInfo.sw_start_date_of_operation;
  user.address = branchInfo.address;
  user.software_date_ais = branchData["software-date-ais"];
  user.branch_type = branchInfo.branch_type;
  user.is_islamic_branch = branchInfo.is_islamic_branch;
  user.software_date = branchData["software-date-mis"];
  return user;
};

// export const loginToAuthService = async (
//   username: string,
//   password: string,
//   domain: string
// ): Promise<{ tokenInfo: object; user: object }> => {
//   const formData = new URLSearchParams({
//     grant_type: "password",
//     username,
//     password,
//     domain,
//   });

// const tokenResponse = await fetch(`${AUTH_SERVICE_URL}/login`, {
//     method: "POST",
//     headers: FORM_HEADERS,
//     // body: formData.toString(),
//   });

//   if (!tokenResponse.ok) {
//     throw new Error("Invalid credentials or server error");
//   }

// // const tokenData = await tokenResponse.json();
// // const tokenInfo = {
// //   access_token: tokenData.token,
// //   expires_in: tokenData.expires_in,
// //   expires_at: tokenData.expires_in + Date.now(),
// // };
// const tokenData = await tokenResponse.json();

// if (tokenData.status !== 200 || !tokenData.token) {
//   throw new Error("Invalid credentials or missing token");
// }

// const tokenInfo = {
//   access_token: tokenData.token,
//   expires_in: tokenData.expires_in,
//   expires_at: tokenData.expires_in + Date.now(),
// };

// const user = { mfi_name: "demo" }; 
// localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
// localStorage.setItem("userData", JSON.stringify(user));


//   const globalDataResponse = await fetch(`${CORE_SERVICE_URL}/global_data/index1`, {
//     method: "GET",
//     headers: {
//     ...AUTH_HEADERS,
//     Authorization: `Bearer ${tokenInfo.access_token}`,
//     "Site-Name": user?.mfi_name,
//   },
//   });

//   if (!globalDataResponse.ok) {
//     throw new Error("Failed to fetch user branch information");
//   }

//   const globalData = await globalDataResponse.json();
//   populateUserBranchInfo(user, globalData.data.branches);

//   return {
//     tokenInfo,
//     user,
//   };
// };

export const loginToAuthService = async (
  username: string,
  password: string,
  domain: string
): Promise<{ tokenInfo: object; user: object }> => {
  const formDataString = `grant_type=password&username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}&domain=${encodeURIComponent(domain)}`;

  const tokenResponse = await fetch(`${AUTH_SERVICE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Site-Name": domain || "disa",
    },
    body: formDataString,
  });

  // ✅ Check HTTP status
  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error("Login error response:", text);
    throw new Error("Invalid credentials or server error");
  }

  const tokenData = await tokenResponse.json();

  // ✅ Make sure status is 200 and token exists
  if (tokenData.status !== 200 || !tokenData.token) {
    console.error("Login failed:", tokenData);
    throw new Error("Invalid credentials or missing token");
  }

  const tokenInfo = {
    access_token: tokenData.token,
    expires_in: tokenData.expires_in,
    expires_at: tokenData.expires_in + Date.now(),
  };

  console.log("✅ Login successful → tokenData:", tokenData);
  console.log("✅ tokenInfo:", tokenInfo);

  const user = { mfi_name: domain || "disa" };

  localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
  localStorage.setItem("userData", JSON.stringify(user));

  return { tokenInfo, user };
};

export const refreshAccessToken = async (refreshToken: string, siteName: string) => {
  const response = await fetch(`${AUTH_SERVICE_URL}/oauth/refresh_token`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Site-Name": siteName },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error("Unable to refresh access token");
  }

  return data;
};

const handleTokenExpiration = async (
  refreshToken: string,
  siteName: string,
  url: string,
  options: RequestInit
) => {
  try {
    const data = await refreshAccessToken(refreshToken, siteName);
    await createAuthCookie(createTokenInfo(data), data?.user);

    const retryHeaders = {
      ...options.headers,
      Authorization: `Bearer ${data.access_token}`,
    };

    return await fetch(url, { ...options, headers: retryHeaders });
  } catch (error: any) {
    console.error("Failed to refresh token:", error.message);
    throw new Error("Session expired. Please log in again.");
  }
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const { mfi_name: mfi } = await getUserData();
  const tokenInfo = await getTokenInfo();
  const headers = {
    "Site-Name": mfi,
    Authorization: `Bearer ${tokenInfo?.access_token}`,
    ...AUTH_HEADERS,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 403 && tokenInfo?.refresh_token) {
    return await handleTokenExpiration(tokenInfo.refresh_token, mfi, url, options);
  }

  return response;
};

export const assistProApiFetch = async (route: string, options: RequestInit = {}) => {
  return apiFetch(`${ASSIST_PRO_SERVICE_URL}/${route}`, options).then((res) => res.json());
};

export const coreApiFetch = async (route: string, options: RequestInit = {}) => {
  return apiFetch(`${CORE_SERVICE_URL}/${route}`, options).then((res) => res.json());
};

export const httpClient = {
  get: async (url: string, options: RequestInit = {}) => {
    const response = await apiFetch(url, { ...options, method: "GET" });
    return response.json();
  },
  post: async (url: string, data: any, options: RequestInit = {}) => {
    const response = await apiFetch(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        ...AUTH_HEADERS,
        ...(options.headers || {}),
      },
    });
    return response.json();
  },
  put: async (url: string, data: any, options: RequestInit = {}) => {
    const response = await apiFetch(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        ...AUTH_HEADERS,
        ...(options.headers || {}),
      },
    });
    return response.json();
  },
  delete: async (url: string, options: RequestInit = {}) => {
    const response = await apiFetch(url, { ...options, method: "DELETE" });
    return response.json();
  },
  download: async (url: string, options: RequestInit = {}) => {
    const response = await apiFetch(url, { ...options, method: "GET" });
    return response.blob();
  },
};
