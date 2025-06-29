import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/helpers/httpClient";
import {createAuthCookie, getTokenInfo, getUserData} from "@/actions/auth.action";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const user = await getUserData();
  const mfi = user.mfi_name;
  const tokenInfo = await getTokenInfo();
  const refresh_token = tokenInfo?.refresh_token;

  if (!refresh_token) {
    return NextResponse.redirect(new URL(`/${mfi}/login`, url.origin));
  }

  try {
    // Refresh the token using the refresh token
    const data = await refreshAccessToken(refresh_token, mfi);

    // Update the cookies with the new access token
    await createAuthCookie(
      {
        access_token: data?.access_token,
        expires_in: data?.expires_in,
        expires_at: data?.expires_in + Date.now(),
        refresh_expires_in: data?.refresh_expires_in,
        refresh_expires_at: data?.refresh_expires_in + Date.now(),
        refresh_token: data?.refresh_token,
        scope: data?.scope,
        token_type: data?.token_type,
      },
      data?.user
    );

    // Redirect the user to the original page
    return NextResponse.redirect(new URL(request.url, url.origin));
  } catch (error: any) {
    return NextResponse.redirect(new URL(`/${mfi}/api/auth/logout`, request.url));
  }
}
