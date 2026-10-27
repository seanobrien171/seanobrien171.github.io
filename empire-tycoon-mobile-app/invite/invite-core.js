// Pure invite-page logic (no DOM), shared by invite.js and tests/referral-links.test.mjs.
// The server builds the link fallback with the same query keys: see supabase/functions/_shared/airbridge.ts.

export const CODE_PARAM = 'c';
export const NAME_PARAM = 'n';
// Clipboard token read by the app's first-open claim screen (UIPasteControl). The app also accepts a bare code.
export const TOKEN_PREFIX = 'empire-invite:v1:';
// 8 characters, no 0, 1, I, L, O or U (the server's referral code alphabet).
export const CODE_PATTERN = /^[2-9A-HJKMNP-TV-Z]{8}$/;
export const NAME_MAX_LENGTH = 24;
export const APP_STORE_URL = 'https://apps.apple.com/app/id6817522924';
export const APP_SCHEME = 'empiretycoon';

export function normalizeCode(raw) {
  if (typeof raw !== 'string') return null;
  const code = raw.replace(/[\s-]/g, '').toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

// Display names are shown with textContent, never as HTML; this only tidies and bounds them.
export function normalizeName(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.replace(/[\p{Cc}\p{Cf}]/gu, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  const chars = Array.from(cleaned);
  return chars.length > NAME_MAX_LENGTH ? chars.slice(0, NAME_MAX_LENGTH).join('').trimEnd() : cleaned;
}

// Query string first; a fragment (#c=...&n=...) is accepted too so links can keep the code out of server logs.
export function readInvite(search, hash) {
  const query = new URLSearchParams(search || '');
  const fragment = new URLSearchParams((hash || '').replace(/^#/, ''));
  const code = normalizeCode(query.get(CODE_PARAM) ?? fragment.get(CODE_PARAM));
  if (!code) return { code: null, name: null };
  return { code, name: normalizeName(query.get(NAME_PARAM) ?? fragment.get(NAME_PARAM)) };
}

export const inviteToken = (code) => `${TOKEN_PREFIX}${code}`;

export const openAppUrl = (code) =>
  code ? `${APP_SCHEME}://invite?${CODE_PARAM}=${encodeURIComponent(code)}` : `${APP_SCHEME}://`;
