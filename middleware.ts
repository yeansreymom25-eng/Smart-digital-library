import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // ─── Public routes ────────────────────────────────────────────────────────
  const isAuthPage =
    pathname.startsWith("/Log_in") ||
    pathname.startsWith("/Sign_up") ||
    pathname.startsWith("/Welcome_Page") ||
    pathname.startsWith("/OTP_Request") ||
    pathname.startsWith("/otp-verify") ||
    pathname.startsWith("/Setnew_Password") ||
    pathname.startsWith("/Update_Password") ||
    pathname.startsWith("/oauth-callback") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/") ||
    pathname === "/";

  // ─── Not logged in → send to login ───────────────────────────────────────
  if (!user && !isAuthPage) {
    const res = NextResponse.redirect(new URL("/Log_in", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // ─── Logged in ────────────────────────────────────────────────────────────
  if (user) {
    const role = user.user_metadata?.role as string | undefined;
    const isAdmin = role === "admin";
    const isSuperAdmin = role === "super_admin";

    // Prevent going back to auth pages after login
    if (isAuthPage && pathname !== "/" && !pathname.startsWith("/api/") && !pathname.startsWith("/auth/")) {
      let dest = "/home";
      if (isSuperAdmin) dest = "/super-admin/dashboard";
      else if (isAdmin) dest = "/library-owner/dashboard";
      const res = NextResponse.redirect(new URL(dest, request.url));
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    // Super admin trying to access wrong routes
    if (isSuperAdmin && !pathname.startsWith("/super-admin") && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
    }

    // Admin trying to access reader or super-admin routes
    if (isAdmin && (isReaderRoute(pathname) || pathname.startsWith("/super-admin"))) {
      return NextResponse.redirect(new URL("/library-owner/dashboard", request.url));
    }

    // Reader trying to access admin or super-admin routes
    if (!isAdmin && !isSuperAdmin && (pathname.startsWith("/library-owner") || pathname.startsWith("/super-admin"))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  response.headers.set("Cache-Control", "no-store");
  return response;
}

function isReaderRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/home") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/my-library") ||
    pathname.startsWith("/book") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/discount")
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};