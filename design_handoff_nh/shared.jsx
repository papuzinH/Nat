// Natalia Heller — shared UI: motifs, placeholders, nav, footer, product card

// ── Placeholder image block ──
function NHPh({ tone = 'a', tall = 1, label, style = {} }) {
  return (
    <div
      className={`nh-ph nh-ph-tone-${tone}`}
      style={{ aspectRatio: `1 / ${tall}`, width: '100%', ...style }}
    >
      {label && <span className="nh-ph-label">{label}</span>}
    </div>
  );
}

// ── Logo: botanical N ──
function NHLogo({ size = 32, color = 'var(--sage-900)' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ color }}>
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <text x="20" y="26.5" textAnchor="middle"
          fontFamily="var(--font-display), serif"
          fontSize="22" fontStyle="italic" fontWeight="500"
          fill="currentColor">
          n
        </text>
        <circle cx="9.5" cy="10" r="1.3" fill="currentColor" opacity="0.7"/>
        <circle cx="31" cy="30.5" r="1.3" fill="currentColor" opacity="0.7"/>
      </svg>
      <span className="nh-serif" style={{ fontSize: 17, fontStyle: 'italic', color }}>
        natalia heller
      </span>
    </div>
  );
}

// ── Motif marks (moderate — stem with dotted leaves) ──
function NHLeafMark({ size = 20, color = 'currentColor' }) {
  return (
    <svg className="nh-motif" width={size} height={size} viewBox="0 0 20 20" style={{ color, display: 'inline-block' }}>
      <path d="M10 2 C 6 5, 4 10, 5 18" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <circle cx="7.2" cy="7.5" r="1.3" fill="currentColor"/>
      <circle cx="6.1" cy="11.5" r="1.3" fill="currentColor"/>
      <circle cx="5.3" cy="15" r="1.3" fill="currentColor"/>
      <circle cx="10" cy="4" r="1.1" fill="currentColor"/>
      <circle cx="13" cy="6.5" r="0.9" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

// Sprig — horizontal leaf stem
function NHSprig({ size = 80, color = 'currentColor', flip = false }) {
  return (
    <svg className="nh-motif" width={size} height={size * 0.4} viewBox="0 0 80 32"
      style={{ color, display: 'inline-block', transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M2 16 Q 20 14, 40 14 T 78 14" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {[10, 22, 34, 46, 58, 70].map((x, i) => (
        <React.Fragment key={i}>
          <ellipse cx={x} cy={i % 2 === 0 ? 8 : 20} rx="5" ry="2" fill="currentColor" opacity="0.85"
            transform={`rotate(${i % 2 === 0 ? -22 : 22} ${x} ${i % 2 === 0 ? 8 : 20})`}/>
        </React.Fragment>
      ))}
      <circle cx="78" cy="14" r="1.6" fill="currentColor"/>
    </svg>
  );
}

// Pressed flower — 5 petal circle
function NHFlower({ size = 40, color = 'currentColor' }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg className="nh-motif" width={size} height={size} viewBox="0 0 40 40" style={{ color, display: 'inline-block' }}>
      {petals.map((a, i) => (
        <ellipse key={i} cx="20" cy="11" rx="4" ry="7" fill="currentColor" opacity="0.75"
          transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="2.3" fill="currentColor"/>
    </svg>
  );
}

function NHDivider({ label }) {
  return (
    <div className="nh-divider-botanical nh-motif" style={{ margin: '0 auto', maxWidth: 720, color: 'var(--sage-500)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NHSprig size={56} />
        {label && <span className="nh-mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sage-700)' }}>{label}</span>}
        <NHSprig size={56} flip />
      </span>
    </div>
  );
}

// ── Header / Nav ──
function NHHeader({ route, go, cartCount, openCart, variant = 'desktop' }) {
  const items = [
    { slug: 'tienda', label: 'Tienda' },
    { slug: 'estudio', label: 'Estudio' },
    { slug: 'blog', label: 'Diario' },
    { slug: 'contacto', label: 'Contacto' },
  ];
  const isActive = (slug) => route.page === slug;

  if (variant === 'mobile') {
    return (
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid var(--line-soft)',
        background: 'var(--cream-100)', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <a onClick={(e) => { e.preventDefault(); go({ page: 'home' }); }} href="#"
          style={{ textDecoration: 'none' }}>
          <NHLogo size={28} />
        </a>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="nh-btn nh-btn-sm" style={{ background: 'transparent', color: 'var(--ink)', padding: '8px 10px' }}
            onClick={openCart}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14l-1.5 9H4.5L3 6z M7 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--sage-700)', color: 'var(--cream-50)',
                width: 18, height: 18, borderRadius: '50%',
                fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', marginLeft: 2,
              }}>{cartCount}</span>
            )}
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'menu' }); }}
            style={{
              width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 999, color: 'var(--ink)',
            }}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M0 1h18 M0 6h18 M0 11h18" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </a>
        </div>
      </header>
    );
  }

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 40px',
      borderBottom: '1px solid var(--line-soft)',
      background: 'rgba(250, 246, 240, 0.92)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'home' }); }} style={{ textDecoration: 'none' }}>
        <NHLogo size={36} />
      </a>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {items.map(it => (
          <a key={it.slug} href="#"
            onClick={(e) => { e.preventDefault(); go({ page: it.slug }); }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              color: isActive(it.slug) ? 'var(--sage-900)' : 'var(--ink)',
              textDecoration: 'none', position: 'relative', paddingBottom: 4,
              borderBottom: isActive(it.slug) ? '1px solid var(--sage-700)' : '1px solid transparent',
              transition: 'all 200ms var(--ease)',
            }}>
            {it.label}
          </a>
        ))}
        <button className="nh-btn nh-btn-sm"
          style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)' }}
          onClick={openCart}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14l-1.5 9H4.5L3 6z M7 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Carrito
          {cartCount > 0 && (
            <span style={{
              background: 'var(--sage-700)', color: 'var(--cream-50)',
              width: 18, height: 18, borderRadius: '50%', fontSize: 11,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
            }}>{cartCount}</span>
          )}
        </button>
      </nav>
    </header>
  );
}

// ── Footer ──
function NHFooter({ go, variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <footer style={{
      marginTop: 80,
      background: 'var(--cream-200)',
      padding: isMobile ? '40px 22px 28px' : '64px 48px 40px',
      borderTop: '1px solid var(--line-soft)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
        gap: isMobile ? 28 : 40, marginBottom: 40,
      }}>
        <div style={{ maxWidth: 320 }}>
          <NHLogo size={32} />
          <p className="nh-serif" style={{ fontSize: isMobile ? 18 : 20, lineHeight: 1.35, marginTop: 14, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
            Arte y tatuaje sensible, desde el huerto del estudio en Buenos Aires.
          </p>
        </div>
        <div>
          <div className="nh-eyebrow-ink" style={{ marginBottom: 12 }}>Navegar</div>
          {['tienda','estudio','contacto'].map(p => (
            <div key={p} style={{ margin: '6px 0' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); go({ page: p }); }}
                className="nh-link" style={{ fontSize: 14, borderBottom: 'none' }}>
                {p[0].toUpperCase() + p.slice(1)}
              </a>
            </div>
          ))}
        </div>
        <div>
          <div className="nh-eyebrow-ink" style={{ marginBottom: 12 }}>Encontrame</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            <div>Instagram</div>
            <a href="#" className="nh-link" onClick={e=>e.preventDefault()}>@nataliaceller_art</a>
            <div style={{ marginTop: 10 }}>Newsletter mensual</div>
            <a href="#" className="nh-link" onClick={e=>e.preventDefault()}>Sumate</a>
          </div>
        </div>
        <div>
          <div className="nh-eyebrow-ink" style={{ marginBottom: 12 }}>Estudio</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            Desde el estudio<br/>Buenos Aires, AR<br/>
            <span style={{ color: 'var(--sage-700)' }}>Con turno previo</span>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 10,
        paddingTop: 22, borderTop: '1px solid var(--line)',
        fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)',
      }}>
        <span>© 2026 · Nat.tatt · Hecho por LHStudio.com.ar</span>
      </div>
    </footer>
  );
}

// ── Product card ──
function NHProductCard({ product, go, onAdd, compact = false }) {
  const p = product;
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); go({ page: 'product', slug: p.slug }); }}
      className="nh-card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div className="nh-card-media">
        <NHPh tone={p.tone} tall={p.tall} label={`${p.cat_label}\n${p.size}`} />
      </div>
      <div style={{ padding: compact ? '12px 2px 2px' : '18px 2px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <h3 className="nh-serif" style={{
            fontSize: compact ? 17 : 20, margin: 0, fontWeight: 500,
            lineHeight: 1.15, color: 'var(--ink)',
          }}>
            {p.title}
          </h3>
          <span className="nh-mono" style={{ fontSize: 12, color: 'var(--sage-700)', whiteSpace: 'nowrap' }}>
            ${p.price.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="nh-mono" style={{
          fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--ink-soft)', marginTop: 6,
        }}>
          {p.cat_label}
        </div>
      </div>
    </a>
  );
}

Object.assign(window, {
  NHPh, NHLogo, NHHeader, NHFooter, NHProductCard, NHLeafMark, NHSprig, NHFlower, NHDivider,
});
