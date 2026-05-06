-- Fix: reemplaza política permisiva por una que requiere sesión autenticada.
-- El admin siempre está autenticado (login via supabase.auth), así que
-- INSERT/UPDATE/DELETE solo funcionan con sesión activa.

DROP POLICY IF EXISTS "Anon full access zones" ON nat_ecommerce.shipping_zones;

CREATE POLICY "Admin write zones"
  ON nat_ecommerce.shipping_zones
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
