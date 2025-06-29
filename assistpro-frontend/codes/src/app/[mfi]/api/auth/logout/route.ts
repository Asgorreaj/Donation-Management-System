import { NextResponse } from "next/server";
import {getUserData} from "@/actions/auth.action";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const user = await getUserData();
  const mfi = user.mfi_name;

  const response = NextResponse.redirect(new URL(`/${mfi}/login`, url.origin));

  // Clear cookies
  response.cookies.delete("tokenInfo");
  response.cookies.delete("userData");

  return response;
}
