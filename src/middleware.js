import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Si hay sesión iniciada y no está en dashboard o admin
  if (token) {
    const userRole = token.role;
    if (url.pathname !== "/dashboard" && url.pathname !== "/admin") {
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }

  // Si no hay sesión y está en una ruta protegida
  const protectedRoutes = ["/dashboard", "/admin"];
  if (!token && protectedRoutes.includes(url.pathname)) {
    const requestedPage = url.pathname;
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si está en login y hay sesión
  if (token && url.pathname === "/login") {
    const userRole = token.role;
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Si está en dashboard o admin
  if (token) {
    const userRole = token.role;
    if (url.pathname === "/dashboard") {
      if (userRole === "user") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    if (url.pathname === "/admin") {
      if (userRole === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files
    // - Image optimization files
    // - Favicon and robots.txt
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|login).*)',
    '/login'
  ],
};
