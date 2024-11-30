import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { checkTokenExpiration } from "@lib/helper";
import { TokenData } from "@lib/types";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const checkPublickRoutesPath = path === "/login";
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  const decoded = !token ? null : (jwtDecode(token) as TokenData);

  const hasExpired = decoded ? checkTokenExpiration(decoded) : true;

  if (checkPublickRoutesPath && !hasExpired) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (
    (path.startsWith("/dashboard") || path.startsWith("/grage")) &&
    hasExpired
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}
