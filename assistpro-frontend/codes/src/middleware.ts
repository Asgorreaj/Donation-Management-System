import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getTokenInfo } from "@/actions/auth.action";

async function handleMissingToken(mfiSegment: string, request: NextRequest) {
  return NextResponse.redirect(new URL(`/${mfiSegment}/login`, request.url));
}

async function handleExpiredToken(mfiSegment: string, request: NextRequest, tokenInfo: any) {
  const currentTime = Date.now();
  const refreshTokenExpiration = tokenInfo.refresh_expires_at;

  if (currentTime > refreshTokenExpiration) {
    return NextResponse.redirect(new URL(`/${mfiSegment}/api/auth/logout`, request.url));
  }
  return NextResponse.redirect(new URL(`/${mfiSegment}/api/auth/refresh`, request.url));
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
