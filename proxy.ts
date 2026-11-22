import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya terapkan proteksi pada seluruh rute /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (token && process.env.AUTH_SECRET) {
      try {
        const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
        await jwtVerify(token, secret);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // Jika belum masuk dan mencoba mengakses rute admin selain login
    if (!isAuthenticated && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Jika sudah masuk dan mencoba membuka kembali halaman login
    if (isAuthenticated && pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
