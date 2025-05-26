import { createServerClient } from "@supabase/ssr";
import { jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";
import { isRoutesMatch } from "../paths";
import { routeProps, SupabaseJwtPayload } from "@/types/globals";

export const ROUTES_CONFIG: Record<string, routeProps[]> = {
  guest: [
    { type: "equal", path: "/login" },
    { type: "equal", path: "/signup" },
    { type: "equal", path: "/forgot-password" },
    { type: "equal", path: "/email-verification" },
    { type: "equal", path: "/reset-password-verification" },
  ],
  user: [{ type: "equal", path: "/user" }],
  admin: [{ type: "equal", path: "/users-management" }],
  creator: [
    { type: "equal", path: "/add-new-test" },
    { type: "start", path: "/tests-management/edit" },
  ],
  adminAndCreator: [{ type: "equal", path: "/tests-management" }],
  common: [
    { type: "equal", path: "/reset-password" },
    { type: "equal", path: "/dashboard" },
  ],
};

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const path = request.nextUrl.pathname;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userRole: string | null = null;
  let armMethod: string | null = null;
  if (user) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const jwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
      userRole = jwt.user_role;
      armMethod = jwt.amr?.[0]?.method || null;
    }
  }
  if (armMethod === "otp" && path !== "/reset-password") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }
  if (isRoutesMatch(path, ROUTES_CONFIG.guest) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  const allProtectedRoutes = [
    ...ROUTES_CONFIG.user,
    ...ROUTES_CONFIG.admin,
    ...ROUTES_CONFIG.creator,
    ...ROUTES_CONFIG.common,
    ...ROUTES_CONFIG.adminAndCreator,
  ];
  if (isRoutesMatch(path, allProtectedRoutes) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
    (isRoutesMatch(path, ROUTES_CONFIG.admin) && userRole !== "admin") ||
    (isRoutesMatch(path, ROUTES_CONFIG.creator) && userRole !== "creator") ||
    (isRoutesMatch(path, ROUTES_CONFIG.adminAndCreator) &&
      !["admin", "creator"].includes(userRole || "")) ||
    (isRoutesMatch(path, ROUTES_CONFIG.user) && userRole)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}
