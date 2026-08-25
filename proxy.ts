import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ─────────── Chronione ścieżki ─────────── */
const CHRONIONE_SCIEZKI = ["/checkout", "/account", "/admin"];

/* ─────────── Nazwa ciasteczka sesyjnego ─────────── */
const COOKIE_NAME = "luxebag_auth_session";

/* ─────────── Proxy (auth guard) ─────────── */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sprawdź czy ścieżka wymaga autoryzacji
  const wymagaAuth = CHRONIONE_SCIEZKI.some(
    (sciezka) => pathname === sciezka || pathname.startsWith(sciezka + "/")
  );

  if (!wymagaAuth) {
    return NextResponse.next();
  }

  // Sprawdź obecność ciasteczka sesyjnego
  const sesja = request.cookies.get(COOKIE_NAME);

  if (sesja) {
    // Użytkownik zalogowany — pozwól przejść
    return NextResponse.next();
  }

  // Brak sesji — przekieruj na logowanie z parametrem zwrotnym
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(url);
}

/* ─────────── Konfiguracja matchera ─────────── */

export const config = {
  matcher: [
    "/checkout/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
