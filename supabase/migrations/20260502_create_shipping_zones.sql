-- Tabla de zonas de envío por barrio
-- Aplicar en el schema nat_ecommerce desde el dashboard de Supabase
-- o via: supabase db push (si tenés el CLI configurado)

CREATE TABLE IF NOT EXISTS nat_ecommerce.shipping_zones (
  id       SERIAL       PRIMARY KEY,
  name     TEXT         NOT NULL,
  price    INTEGER      NOT NULL DEFAULT 0,
  active   BOOLEAN      NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE nat_ecommerce.shipping_zones ENABLE ROW LEVEL SECURITY;

-- Lectura pública (checkout)
CREATE POLICY "Public read active zones"
  ON nat_ecommerce.shipping_zones
  FOR SELECT
  USING (true);

-- Escritura desde el admin (anon key)
CREATE POLICY "Anon full access zones"
  ON nat_ecommerce.shipping_zones
  FOR ALL
  USING (true)
  WITH CHECK (true);
