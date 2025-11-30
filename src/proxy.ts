// proxy.ts
import { NextRequest, NextResponse } from "next/server";

// --- Localisation config ---
const SUPPORTED_LOCALES = ["en", "fr"];
const DEFAULT_LOCALE = "en";

// Matches: /en/page, /fr, /de/products/x
const LOCALE_REGEX = /^\/([a-zA-Z-]{2,6})(\/|$)/;

export default function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname, search } = url;

  const localeMatch = pathname.match(LOCALE_REGEX);

  if (localeMatch) {
    const locale = localeMatch[1];

    // If unsupported locale → redirect to default
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, url.origin)
      );
    }

    // Strip the locale for internal routing
    const rewrittenPath =
      pathname.replace(`/${locale}`, "") || "/";

    const response = NextResponse.rewrite(
      new URL(rewrittenPath + search, url.origin)
    );

    // Set cookie so React server components can read it
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      sameSite: "lax",
    });

    // Also expose locale via header for server components
    response.headers.set("x-next-locale", locale);

    return response;
  }

  return NextResponse.redirect(
    new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, url.origin)
  );
}
