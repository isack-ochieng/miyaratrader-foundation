import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface DerivConfig {
  appId: string;
  redirectUrl: string;
}

/** Public: the Deriv app id and approved redirect URL are not secrets. */
export const getDerivConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<DerivConfig> => ({
    appId: process.env["DERIV_APP_ID"] ?? "",
    redirectUrl: process.env["DERIV_REDIRECT_URL"] ?? "",
  }),
);

interface IncomingAccount {
  account_id: string;
  token: string;
  currency?: string;
}

function validateAccounts(input: { accounts: IncomingAccount[] }) {
  if (!input || !Array.isArray(input.accounts) || input.accounts.length === 0) {
    throw new Error("No Deriv accounts supplied.");
  }
  return {
    accounts: input.accounts.slice(0, 10).map((a) => ({
      account_id: String(a.account_id).trim().slice(0, 64),
      token: String(a.token).trim(),
      currency: (a.currency ?? "USD").toString().trim().slice(0, 10).toUpperCase(),
    })),
  };
}

/** Stores Deriv access tokens encrypted at rest, scoped to the signed-in user. */
export const saveDerivAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateAccounts)
  .handler(async ({ data, context }) => {
    const { encryptDerivToken, isLikelyDerivToken } = await import("@/lib/deriv.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let saved = 0;
    for (const account of data.accounts) {
      if (!account.account_id || !isLikelyDerivToken(account.token)) continue;
      const row = {
        user_id: context.userId,
        account_id: account.account_id,
        currency: account.currency,
        is_virtual: /^VRT/i.test(account.account_id),
        token_encrypted: encryptDerivToken(account.token),
        status: "connected",
        last_synced_at: new Date().toISOString(),
      };

      const { data: existing } = await supabaseAdmin
        .from("deriv_connections")
        .select("id")
        .eq("user_id", context.userId)
        .eq("account_id", account.account_id)
        .maybeSingle();

      const { error } = existing
        ? await supabaseAdmin.from("deriv_connections").update(row).eq("id", existing.id)
        : await supabaseAdmin.from("deriv_connections").insert(row);
      if (error) throw new Error(error.message);
      saved += 1;
    }

    if (saved === 0) throw new Error("No valid Deriv account tokens were supplied.");
    return { saved };
  });
