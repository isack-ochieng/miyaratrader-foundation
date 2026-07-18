// Deriv OAuth helpers.
// Deriv's OAuth uses app_id + a pre-registered redirect URL on the app.
// For production, register your own app at https://api.deriv.com/dashboard and
// set DERIV_APP_ID via VITE_DERIV_APP_ID. Default 1089 is Deriv's public
// tutorial app_id.
export const DERIV_APP_ID =
  (import.meta.env.VITE_DERIV_APP_ID as string | undefined) ?? "1089";

export const DERIV_OAUTH_URL = "https://oauth.deriv.com/oauth2/authorize";

export function buildDerivAuthUrl(redirectUri: string) {
  const params = new URLSearchParams({
    app_id: DERIV_APP_ID,
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
