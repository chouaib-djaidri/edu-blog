import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  return await updateSession(request, response);
}
export const config = {
  matcher: ["/", "/(en|ar)/:path*", "/((?!_next|_vercel|api|auth|.*\\..*).*)"],
};
