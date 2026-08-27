/* ─────────── Ciasteczko sesyjne auth ─────────── */

const COOKIE_NAME = "luxebag_auth_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14 // 14 dni (domyślny TTL Firebase Auth)

/**
 * Ustawia ciasteczko sesyjne na stronie klienta.
 * Wywoływane po udanym logowaniu.
 */
export function setAuthCookie(uid: string): void {
  document.cookie = `${COOKIE_NAME}=${uid}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
}

/**
 * Usuwa ciasteczko sesyjne na stronie klienta.
 * Wywoływane po wylogowaniu.
 */
export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax; Secure`
}

/**
 * Odczytuje ciasteczko sesyjne z nagłówka (serwer — middleware/SSR).
 * Zwraca wartość ciasteczka lub null.
 */
export function getAuthCookieFromHeaders(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) return null

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
  )
  return match ? match[1] : null
}
