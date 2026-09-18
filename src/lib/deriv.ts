// Deriv OAuth helpers (browser-safe).
// The app id and the approved redirect URL are stored server-side and fetched
// through the getDerivConfig server function.
export const DERIV_OAUTH_URL = "https://oauth.deriv.com/oauth2/authorize";

export function buildDerivAuthUrl(appId: string, redirectUri: string) {
  if (!appId) throw new Error("Deriv connection is awaiting the MiyaraTrader App ID.");
  const params = new URLSearchParams({
    app_id: appId,
    l: "EN",
    brand: "deriv",
    redirect_uri: redirectUri,
  });
  return `${DERIV_OAUTH_URL}?${params.toString()}`;
}

export interface DerivAccountFromCallback {
  account_id: string;
  token: string;
  currency: string;
}

// Deriv returns query params: acct1=CR123&token1=a1-xxx&cur1=USD&acct2=...
export function parseDerivCallback(search: string): DerivAccountFromCallback[] {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const accounts: DerivAccountFromCallback[] = [];
  for (let i = 1; i <= 10; i++) {
    const acct = params.get(`acct${i}`);
    const token = params.get(`token${i}`);
    const cur = params.get(`cur${i}`) ?? "USD";
    if (acct && token) accounts.push({ account_id: acct, token, currency: cur });
  }
  return accounts;
}
