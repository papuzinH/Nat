-- Blog posts para NatArt
-- Schema: nat_ecommerce
-- El cuerpo del post se guarda como TipTap JSON (JSONB)

CREATE TABLE IF NOT EXISTS nat_ecommerce.blog_posts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  subtitle         TEXT        NOT NULL DEFAULT '',
  category         TEXT        NOT NULL DEFAULT 'Estudio',
  date             DATE        NOT NULL DEFAULT CURRENT_DATE,
  reading_time     TEXT        NOT NULL DEFAULT '5 min',
  cover_image      TEXT,
  body             JSONB       NOT NULL DEFAULT '{"type":"doc","content":[]}',
  excerpt          TEXT        NOT NULL DEFAULT '',
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  related          TEXT[]      NOT NULL DEFAULT '{}',
  published        BOOLEAN     NOT NULL DEFAULT false,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date
  ON nat_ecommerce.blog_posts (published, date DESC)
  WHERE published = true;

CREATE OR REPLACE FUNCTION nat_ecommerce.set_blog_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON nat_ecommerce.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON nat_ecommerce.blog_posts
  FOR EACH ROW EXECUTE FUNCTION nat_ecommerce.set_blog_updated_at();

ALTER TABLE nat_ecommerce.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published posts" ON nat_ecommerce.blog_posts;
DROP POLICY IF EXISTS "Admin read all posts" ON nat_ecommerce.blog_posts;
DROP POLICY IF EXISTS "Admin write posts" ON nat_ecommerce.blog_posts;

-- Anónimos: solo posts publicados
CREATE POLICY "Public read published posts"
  ON nat_ecommerce.blog_posts FOR SELECT
  USING (published = true);

-- Admin autenticado: lectura total (incluye borradores)
CREATE POLICY "Admin read all posts"
  ON nat_ecommerce.blog_posts FOR SELECT TO authenticated
  USING (true);

-- Admin autenticado: escritura total
CREATE POLICY "Admin write posts"
  ON nat_ecommerce.blog_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
