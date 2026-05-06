-- Un CP solo puede pertenecer a una zona (UNIQUE garantiza esto)
CREATE TABLE IF NOT EXISTS nat_ecommerce.shipping_zone_postal_codes (
  id          SERIAL  PRIMARY KEY,
  zone_id     INTEGER NOT NULL
                REFERENCES nat_ecommerce.shipping_zones(id)
                ON DELETE CASCADE,
  postal_code TEXT    NOT NULL,
  CONSTRAINT unique_postal_code UNIQUE (postal_code)
);

ALTER TABLE nat_ecommerce.shipping_zone_postal_codes ENABLE ROW LEVEL SECURITY;

-- Lectura pública (checkout necesita los CPs para auto-detectar)
CREATE POLICY "Public read postal codes"
  ON nat_ecommerce.shipping_zone_postal_codes
  FOR SELECT
  USING (true);

-- Escritura solo admin autenticado
CREATE POLICY "Admin write postal codes"
  ON nat_ecommerce.shipping_zone_postal_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX ON nat_ecommerce.shipping_zone_postal_codes (zone_id);
