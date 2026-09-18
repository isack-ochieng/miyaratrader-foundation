-- Keep encrypted Deriv tokens out of client-readable columns.
REVOKE SELECT ON public.deriv_connections FROM authenticated;
GRANT SELECT (id, user_id, account_id, currency, is_virtual, balance, status, last_synced_at, created_at, updated_at)
  ON public.deriv_connections TO authenticated;
REVOKE INSERT, UPDATE ON public.deriv_connections FROM authenticated;
GRANT INSERT (id, user_id, account_id, currency, is_virtual, balance, status)
  ON public.deriv_connections TO authenticated;
GRANT UPDATE (currency, is_virtual, balance, status)
  ON public.deriv_connections TO authenticated;
GRANT ALL ON public.deriv_connections TO service_role;
