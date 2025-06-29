"use server";

import { cookies } from "next/headers";

export const createAuthCookie = async (
  tokenInfo: object,
  user: object
) => {
  const cookieStore = await cookies();

  // Set token info
  cookieStore.set("tokenInfo", JSON.stringify(tokenInfo), {
    //secure: true,
    httpOnly: true,
    path: "/",
  });

  // Set user data (JSON-encoded)
  cookieStore.set("userData", JSON.stringify(user), {
    //secure: true,
    path: "/",
  });
};

export const deleteAuthCookie = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("tokenInfo");
  cookieStore.delete("userData");
};

// To retrieve user data from cookies
export const getUserData = async () => {
  const cookieStore = await cookies();
  const userData = cookieStore.get("userData")?.value;

  if (userData) {
    return JSON.parse(userData); // Parse the JSON string back to an object
  }

  return null; // No user data available
};

// To retrieve token info from cookies
export const getTokenInfo = async () => {
  const cookieStore = await cookies();
  const tokenInfo = cookieStore.get("tokenInfo")?.value;

  if (tokenInfo) {
    return JSON.parse(tokenInfo); // Parse the JSON string back to an object
  }

  return null; // No token info available
};
