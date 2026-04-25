// Natalia Heller — Blog listing + Single post

const NH_BLOG_CATS = ['Todos', 'Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles'];

// ═══════════════════ BLOG INDEX ═══════════════════
function NHBlog({ go, isMobile }) {
  const [cat, setCat] = React.useState('Todos');
  const pad = isMobile ? '22px' : '48px';
  const filtered = cat === 'Todos' ? NH_POSTS : NH_POSTS.filter(p => p.category === cat);
  const [featured, ...rest] = filtered;

  return (
    <div className="nh-page-enter">
      {/* Header */}
      <section style={{ padding: isMobile ? '28px 22px 32px' : '60px 48px 48px', position: 'relative' }}>
        <div className="nh-motif" style={{ position: 'absolute', top: isMobile ? 20 : 44, right: isMobile ? 22 : 48, color: 'var(--sage-500)', pointerEvents: 'none' }}>
          <NHLeafMark size={isMobile ? 40 : 56} />
        </div>
        <div className="nh-eyebrow" style={{ marginBottom: 14 }}>Diario del estudio</div>
        <h1 className="nh-serif" style={{
          fontSize: isMobile ? 38 : 72, margin: 0, fontWeight: 400,
          letterSpacing: '-0.02em', lineHeight: 1.02, maxWidth: 800,
        }}>
          Notas sobre proceso, plantas y oficio.
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-soft)', marginTop: 16, maxWidth: 540, lineHeight: 1.65 }}>
          Una vez al mes escribo sobre lo que estoy aprendiendo. Sin agenda,
          sin newsletter de lunes. Sólo notas del taller.
        </p>
      </section>

      {/* Filters */}
      <div style={{
        padding: `10px ${pad}`,
        position: 'sticky', top: isMobile ? 57 : 78, zIndex: 10,
        background: 'rgba(250, 246, 240, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line-soft)',
      }}>
        <div className="nh-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {NH_BLOG_CATS.map(c => (
            <button key={c}
              className={`nh-filter ${cat === c ? 'is-active' : ''}`}
              onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '80px 48px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div className="nh-serif" style={{ fontSize: 22, fontStyle: 'italic' }}>Nada por acá todavía</div>
        </div>
      ) : (
        <section style={{ padding: `0 ${pad}`, marginTop: isMobile ? 32 : 56 }}>

          {/* Featured post */}
          {featured && (
            <a href="#"
              onClick={(e) => { e.preventDefault(); go({ page: 'post', slug: featured.slug }); }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: isMobile ? 40 : 72 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? 20 : 56, alignItems: 'center',
              }}>
                <div style={{ overflow: 'hidden', borderRadius: 4 }}>
                  <NHPh tone={featured.tone} tall={featured.tall}
                    label={`${featured.category} · ${featured.date}`}
                    style={{
                      transition: 'transform 500ms var(--ease)',
                    }} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                    <span className="nh-filter is-active" style={{ pointerEvents: 'none', fontSize: 11 }}>{featured.category}</span>
                    <span className="nh-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.12em' }}>{featured.date} · {featured.reading} lectura</span>
                  </div>
                  <h2 className="nh-serif" style={{
                    fontSize: isMobile ? 28 : 48, margin: 0, fontWeight: 400,
                    letterSpacing: '-0.02em', lineHeight: 1.08,
                  }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.65, maxWidth: 480 }}>
                    {featured.subtitle}
                  </p>
                  <div style={{
                    marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase',
                    letterSpacing: '0.14em', color: 'var(--sage-700)',
                    borderBottom: '1px solid var(--sage-700)', paddingBottom: 2,
                  }}>
                    Leer nota →
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div style={{ margin: isMobile ? '0 0 32px' : '0 0 52px' }}>
              <NHDivider label="más notas" />
            </div>
          )}

          {/* Rest grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 28 : 40,
            marginBottom: 80,
          }}>
            {rest.map(post => (
              <NHBlogCard key={post.slug} post={post} go={go} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NHBlogCard({ post, go }) {
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); go({ page: 'post', slug: post.slug }); }}
      className="nh-card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div className="nh-card-media" style={{ overflow: 'hidden', borderRadius: 3 }}>
        <NHPh tone={post.tone} tall={post.tall} label={`${post.category} · ${post.date}`} />
      </div>
      <div style={{ padding: '16px 2px 4px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <span className="nh-eyebrow" style={{ color: 'var(--sage-700)' }}>{post.category}</span>
          <span className="nh-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>{post.reading}</span>
        </div>
        <h3 className="nh-serif" style={{ fontSize: 22, margin: 0, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.6 }}>
          {post.subtitle}
        </p>
        <div className="nh-mono" style={{ fontSize: 10, color: 'var(--taupe-700)', marginTop: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {post.date}
        </div>
      </div>
    </a>
  );
}

// ═══════════════════ SINGLE POST ═══════════════════
function NHPost({ slug, go, isMobile }) {
  const post = NH_POSTS.find(p => p.slug === slug) || NH_POSTS[0];
  const related = post.related
    .map(s => NH_POSTS.find(p => p.slug === s))
    .filter(Boolean);
  const pad = isMobile ? '22px' : '48px';

  return (
    <div className="nh-page-enter">
      {/* Breadcrumb */}
      <div style={{ padding: `18px ${pad} 0`, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'blog' }); }}
          style={{ color: 'inherit', textDecoration: 'none' }}>diario</a>
        {' / '}
        <span style={{ color: 'var(--sage-700)' }}>{post.slug}</span>
      </div>

      {/* Hero */}
      <section style={{ padding: isMobile ? '22px 22px 0' : '36px 48px 0' }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
            <span className="nh-filter is-active" style={{ pointerEvents: 'none', fontSize: 11 }}>{post.category}</span>
            <span className="nh-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.12em' }}>
              {post.date} · {post.reading} lectura
            </span>
          </div>
          <h1 className="nh-serif" style={{
            fontSize: isMobile ? 36 : 68, margin: 0, fontWeight: 400,
            letterSpacing: '-0.02em', lineHeight: 1.04,
          }}>
            {post.title}
          </h1>
          <p className="nh-serif" style={{
            fontSize: isMobile ? 18 : 22, color: 'var(--ink-soft)', marginTop: 18,
            lineHeight: 1.5, fontStyle: 'italic',
          }}>
            {post.subtitle}
          </p>
        </div>
      </section>

      {/* Cover image */}
      <div style={{ padding: `24px ${pad} 0`, maxWidth: isMobile ? '100%' : 860, paddingRight: isMobile ? pad : pad }}>
        <NHPh tone={post.tone} tall={0.55} label={`Imagen · ${post.title}`}
          style={{ borderRadius: 4, boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }} />
      </div>

      {/* Body */}
      <article style={{
        padding: isMobile ? '44px 22px 20px' : '64px 48px 20px',
        maxWidth: isMobile ? '100%' : 720,
      }}>
        {/* Author strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '18px 0 32px', borderBottom: '1px solid var(--line)',
          marginBottom: 40,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--sage-500)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <NHLeafMark size={22} color="var(--cream-50)" />
          </div>
          <div>
            <div className="nh-serif" style={{ fontSize: 15, fontWeight: 500 }}>Natalia Heller</div>
            <div className="nh-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Villa Crespo · {post.date}
            </div>
          </div>
        </div>

        {post.body.map((block, i) => {
          if (block.t === 'p') return (
            <p key={i} style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.75, color: 'var(--ink)', marginBottom: 22 }}>
              {block.c}
            </p>
          );
          if (block.t === 'h2') return (
            <h2 key={i} className="nh-serif" style={{
              fontSize: isMobile ? 24 : 32, fontWeight: 400, letterSpacing: '-0.01em',
              margin: '48px 0 18px', lineHeight: 1.15,
            }}>
              {block.c}
            </h2>
          );
          if (block.t === 'ul') return (
            <ul key={i} style={{ margin: '0 0 24px 0', padding: '0 0 0 0', listStyle: 'none' }}>
              {block.c.map((item, j) => (
                <li key={j} style={{
                  display: 'flex', gap: 14, padding: '10px 0',
                  borderBottom: '1px solid var(--line-soft)',
                  fontSize: isMobile ? 15 : 17, lineHeight: 1.6, color: 'var(--ink)',
                }}>
                  <span style={{ color: 'var(--sage-500)', flexShrink: 0, marginTop: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="5" cy="5" r="1.2" fill="currentColor"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          );
          return null;
        })}

        {/* Signature */}
        <div style={{
          marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div className="nh-motif" style={{ color: 'var(--sage-500)' }}>
            <NHFlower size={32} />
          </div>
          <div className="nh-serif" style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--ink-soft)' }}>
            Natalia Heller — escrito desde el estudio, Villa Crespo.
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: isMobile ? '60px 22px 40px' : '100px 48px 60px' }}>
          <div style={{ marginBottom: 28 }}>
            <NHDivider label="seguir leyendo" />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : `repeat(${related.length}, 1fr)`,
            gap: isMobile ? 24 : 36, marginTop: 36,
          }}>
            {related.map(p => <NHBlogCard key={p.slug} post={p} go={go} />)}
          </div>
        </section>
      )}
    </div>
  );
}

Object.assign(window, { NHBlog, NHBlogCard, NHPost });
