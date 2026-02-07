import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api)
  // - tRPC routes (/trpc)
  // - Next.js internals (/_next, /_vercel)
  // - Static files with extensions (e.g., favicon.ico, images)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
