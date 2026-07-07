import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getTokenInfo } from "@/actions/auth.action";

async function handleMissingToken(mfiSegment: string, request: NextRequest) {
  return NextResponse.redirect(new URL(`/${mfiSegment}/login`, request.url));
}

async function handleExpiredToken(mfiSegment: string, request: NextRequest, tokenInfo: any) {
  // Our simplified backend has no working refresh-token endpoint,
  // so on expiry we just clear the session and send the user to login
  // instead of looping through /api/auth/refresh forever.
  return NextResponse.redirect(new URL(`/${mfiSegment}/api/auth/logout`, request.url));
}

export async function middleware(request: NextRequest) {
  const NOT_FOUND_STATUS = { status: 404 };
  const LOGIN_SUFFIX = "/login";
  const pathname = request.nextUrl.pathname;
  const mfiSegment = pathname.split("/")[1];

  if (!mfiSegment) {
    return new NextResponse("Not Found", NOT_FOUND_STATUS);
  }

  const tokenInfo = await getTokenInfo();
  
  // Allow access to the login page if the user is not authenticated
  if (!tokenInfo) {
    if (pathname === `/${mfiSegment}${LOGIN_SUFFIX}`) {
      return NextResponse.next();  // Allow login page access
    }
    return handleMissingToken(mfiSegment, request);  // Redirect to login if no token
  }

  // Handle token expiration
  if (Date.now() > tokenInfo.expires_at) {
    return handleExpiredToken(mfiSegment, request, tokenInfo);
  }

  // Redirect from login page if the user is authenticated
  if (pathname === `/${mfiSegment}${LOGIN_SUFFIX}`) {
    return NextResponse.redirect(new URL(`/${mfiSegment}`, request.url));  // Redirect to home page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:mfi", "/:mfi/login", "/:mfi/students", "/:mfi/donations", "/:mfi/reports", "/reports"],
};