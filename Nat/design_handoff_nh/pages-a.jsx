// Natalia Heller — page components (Home, Tienda, Product, Estudio, Contacto)

const ARS = (n) => `$${n.toLocaleString('es-AR')}`;

// ═══════════════════ HOME ═══════════════════
function NHHome({ go, onAdd, isMobile }) {
  const featured = NH_PRODUCTS.slice(0, isMobile ? 4 : 6);
  const pad = isMobile ? '22px' : '48px';

  const heroSlides = [
    { tone: 'd', label: 'Foto estudio\nplantas y luz de tarde' },
    { tone: 'a', label: 'Detalle · acuarela' },
    { tone: 'b', label: 'Cerámica recién salida\ndel horno' },
    { tone: 'c', label: 'Manos trabajando' },
    { tone: 'f', label: 'Botánica prensada' },
  ];
  const [slide, setSlide] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="nh-page-enter">
      {/* Hero */}
      <section style={{ padding: isMobile ? '28px 22px 48px' : '64px 48px 88px', position: 'relative' }}>
        <div className="nh-motif" style={{ position: 'absolute', top: isMobile ? 24 : 48, right: isMobile ? 22 : 48, color: 'var(--sage-500)', zIndex: 2, pointerEvents: 'none' }}>
          <NHLeafMark size={isMobile ? 42 : 56} />
        </div>
        <div className="nh-motif" style={{ position: 'absolute', bottom: isMobile ? 12 : 40, left: isMobile ? 18 : 40, color: 'var(--sage-500)', opacity: 0.7, pointerEvents: 'none' }}>
          <NHFlower size={isMobile ? 30 : 46} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr',
          gap: isMobile ? 32 : 72,
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <div>
            <div className="nh-eyebrow" style={{ marginBottom: 22 }}>
              <span className="nh-motif-mark" style={{ color: 'var(--sage-700)' }}>
                <span className="line nh-motif" /> Estudio · Buenos Aires · desde 2019
              </span>
            </div>

            <h1 className="nh-serif" style={{
              fontSize: isMobile ? 42 : 78, lineHeight: 1.02,
              letterSpacing: '-0.02em', margin: 0, fontWeight: 400,
            }}>
              Botánica sensible,<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--sage-700)' }}>hecha con paciencia.</span>
            </h1>

            <p style={{
              fontSize: isMobile ? 16 : 18, lineHeight: 1.65, marginTop: isMobile ? 22 : 28,
              maxWidth: 480, color: 'var(--ink-soft)',
            }}>
              Obra en papel, cerámica, textiles y tatuaje de línea fina. Cada pieza
              nace despacio en el estudio del barrio Desde el estudio, rodeada de plantas.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: isMobile ? 26 : 36, flexWrap: 'wrap' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'tienda' }); }} className="nh-btn nh-btn-primary">
                Explorar la tienda
                <span>→</span>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'estudio' }); }} className="nh-btn nh-btn-ghost">
                Reservar tatuaje
              </a>
            </div>
          </div>

          {/* Right — carousel */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative', width: '100%',
              aspectRatio: '4/5', overflow: 'hidden', borderRadius: 4,
              background: 'var(--cream-200)',
              boxShadow: '0 20px 60px rgba(74, 124, 89, 0.1), 0 2px 6px rgba(44, 44, 44, 0.06)',
            }}>
              {heroSlides.map((s, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: slide === i ? 1 : 0,
                  transform: slide === i ? 'scale(1)' : 'scale(1.04)',
                  transition: 'opacity 700ms var(--ease), transform 900ms var(--ease)',
                }}>
                  <NHPh tone={s.tone} tall={1} label={s.label} style={{ height: '100%', aspectRatio: 'auto' }} />
                </div>
              ))}

              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: 'rgba(253, 252, 251, 0.92)',
                padding: '5px 10px', borderRadius: 2,
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.14em', color: 'var(--sage-700)',
              }}>
                {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </div>

              <button onClick={() => setSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
                style={{
                  position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(253, 252, 251, 0.92)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', fontSize: 18, fontFamily: 'var(--font-display)',
                  boxShadow: '0 2px 8px rgba(44, 44, 44, 0.1)',
                }}>←</button>
              <button onClick={() => setSlide(s => (s + 1) % heroSlides.length)}
                style={{
                  position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(253, 252, 251, 0.92)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', fontSize: 18, fontFamily: 'var(--font-display)',
                  boxShadow: '0 2px 8px rgba(44, 44, 44, 0.1)',
                }}>→</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  style={{
                    width: slide === i ? 22 : 6, height: 6,
                    borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0,
                    background: slide === i ? 'var(--sage-700)' : 'var(--taupe-500)',
                    opacity: slide === i ? 1 : 0.4,
                    transition: 'all 300ms var(--ease)',
                  }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section style={{ padding: `0 ${pad}`, marginTop: isMobile ? 20 : 40, position: 'relative' }}>
        <div className="nh-motif" style={{ position: 'absolute', top: -20, right: isMobile ? 22 : 48, color: 'var(--sage-400)', opacity: 0.5 }}>
          <NHSprig size={isMobile ? 70 : 110} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: isMobile ? 20 : 32, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div className="nh-eyebrow" style={{ marginBottom: 10 }}>Tienda</div>
            <h2 className="nh-serif" style={{ fontSize: isMobile ? 28 : 44, margin: 0, fontWeight: 400, letterSpacing: '-0.02em' }}>
              Piezas que acaban de salir del estudio
            </h2>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'tienda' }); }} className="nh-link" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', borderBottom: 'none' }}>
            Ver todo →
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 28,
        }}>
          {featured.map(p => (
            <NHProductCard key={p.slug} product={p} go={go} onAdd={onAdd} compact={isMobile} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ margin: isMobile ? '60px 0 40px' : '120px 0 60px' }}>
        <NHDivider label="estudio + tatuaje" />
      </div>

      {/* Tattoo teaser */}
      <section style={{ padding: `0 ${pad}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 28 : 64, alignItems: 'center',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? 10 : 14 }}>
            <NHPh tone="a" tall={1.35} label={'Boceto helecho\n(línea fina)'} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 14, marginTop: isMobile ? 16 : 32 }}>
              <NHPh tone="d" tall={1.1} label={'Tatuaje en piel\n(antebrazo)'} />
              <NHPh tone="b" tall={0.9} label={'Detalle'} />
            </div>
          </div>

          <div>
            <div className="nh-eyebrow" style={{ marginBottom: 14 }}>El estudio</div>
            <h2 className="nh-serif" style={{ fontSize: isMobile ? 28 : 48, margin: 0, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Tatuajes de línea fina, pensados con vos.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 20, color: 'var(--ink-soft)', maxWidth: 480 }}>
              Trabajo despacio, en sesiones largas y cálidas. Botánica, ornamentos
              y piezas personales dibujadas exclusivamente para cada persona. Tomo
              hasta tres personas por semana.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); go({ page: 'estudio' }); }} className="nh-btn nh-btn-primary">
                Conocer el estudio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story strip */}
      <section style={{ padding: isMobile ? '80px 22px 40px' : '140px 48px 60px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div className="nh-eyebrow" style={{ marginBottom: 18, justifyContent: 'center', display: 'flex' }}>· Sobre el estudio ·</div>
          <p className="nh-serif" style={{ fontSize: isMobile ? 22 : 32, lineHeight: 1.35, margin: 0, fontStyle: 'italic', color: 'var(--ink)', fontWeight: 400 }}>
            “Cada obra empieza en el huerto del patio: hojas que seco, flores que dibujo, colores que preparo con ceniza y cebolla. Trabajar con la mano puesta en la tierra.”
          </p>
          <div className="nh-mono" style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sage-700)' }}>
            — Natalia, desde el estudio
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════ TIENDA ═══════════════════
function NHTienda({ go, onAdd, isMobile }) {
  const [cat, setCat] = React.useState('todos');
  const filtered = cat === 'todos' ? NH_PRODUCTS : NH_PRODUCTS.filter(p => p.category === cat);
  const pad = isMobile ? '22px' : '48px';

  return (
    <div className="nh-page-enter">
      <section style={{ padding: isMobile ? '28px 22px 24px' : '56px 48px 32px' }}>
        <div className="nh-eyebrow" style={{ marginBottom: 14 }}>Tienda · {NH_PRODUCTS.length} piezas</div>
        <h1 className="nh-serif" style={{ fontSize: isMobile ? 38 : 72, margin: 0, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.02 }}>
          Obra disponible
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--ink-soft)', marginTop: 16, maxWidth: 540, lineHeight: 1.6 }}>
          Piezas únicas y ediciones firmadas. Cada obra sale del estudio con envoltorio
          en papel reciclado y una nota escrita a mano.
        </p>
      </section>

      {/* Filters */}
      <section style={{
        padding: `12px ${pad}`,
        position: 'sticky', top: isMobile ? 57 : 78, zIndex: 10,
        background: 'rgba(250, 246, 240, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line-soft)',
      }}>
        <div className="nh-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {NH_CATEGORIES.map(c => (
            <button key={c.slug}
              className={`nh-filter ${cat === c.slug ? 'is-active' : ''}`}
              onClick={() => setCat(c.slug)}>
              {c.label}
              {cat === c.slug && <span style={{ marginLeft: 6, opacity: 0.7 }}>
                {c.slug === 'todos' ? NH_PRODUCTS.length : NH_PRODUCTS.filter(p => p.category === c.slug).length}
              </span>}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: isMobile ? '32px 22px 20px' : '48px 48px 40px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>
            <div className="nh-serif" style={{ fontSize: 24, fontStyle: 'italic' }}>Nada nuevo por acá todavía</div>
            <p style={{ marginTop: 8 }}>Sumate al newsletter para enterarte primero.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 16 : 32,
          }}>
            {filtered.map(p => (
              <NHProductCard key={p.slug} product={p} go={go} onAdd={onAdd} compact={isMobile} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ═══════════════════ PRODUCT DETAIL ═══════════════════
function NHProduct({ slug, go, onAdd, isMobile }) {
  const p = NH_PRODUCTS.find(x => x.slug === slug) || NH_PRODUCTS[0];
  const [size, setSize] = React.useState(p.sizes ? p.sizes[Math.min(2, p.sizes.length - 1)] : null);
  const [frame, setFrame] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const pad = isMobile ? '22px' : '48px';

  const price = React.useMemo(() => {
    let base = p.price;
    if (p.sizes && size) {
      const mult = { A6: 0.55, A5: 0.75, A4: 1, A3: 1.6 }[size] || 1;
      base = Math.round(base * mult);
    }
    if (frame) base += 12000;
    return base;
  }, [p, size, frame]);

  const handleAdd = () => {
    onAdd({ slug: p.slug, title: p.title, price, size, frame, tone: p.tone });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const related = NH_PRODUCTS.filter(x => x.category === p.category && x.slug !== p.slug).slice(0, isMobile ? 2 : 3);

  return (
    <div className="nh-page-enter">
      <section style={{ padding: isMobile ? '18px 22px 8px' : '28px 48px 8px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
          <a href="#" onClick={(e)=>{e.preventDefault();go({page:'tienda'})}} style={{color:'inherit', textDecoration:'none'}}>tienda</a>
          {' / '}
          <a href="#" onClick={(e)=>{e.preventDefault();go({page:'tienda'})}} style={{color:'inherit', textDecoration:'none'}}>{p.cat_label.toLowerCase()}</a>
          {' / '}
          <span style={{ color: 'var(--sage-700)' }}>{p.title.toLowerCase()}</span>
        </div>
      </section>

      <section style={{ padding: `0 ${pad}`, marginTop: isMobile ? 18 : 32 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? 24 : 72, alignItems: 'flex-start',
        }}>
          {/* Gallery */}
          <div>
            <NHPh tone={p.tone} tall={p.tall} label={`${p.title}\n${p.size}`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: isMobile ? 8 : 12, marginTop: isMobile ? 10 : 14 }}>
              {['a','b','c','d'].map((_, i) => (
                <NHPh key={i} tone={p.tone} tall={1} label={i === 0 ? 'Detalle' : `Vista ${i+1}`} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 100 }}>
            <div className="nh-eyebrow" style={{ marginBottom: 10 }}>{p.cat_label}</div>
            <h1 className="nh-serif" style={{ fontSize: isMobile ? 34 : 52, margin: 0, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              {p.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 18 }}>
              <span className="nh-serif" style={{ fontSize: 28, color: 'var(--sage-900)' }}>
                {ARS(price)}
              </span>
              <span className="nh-mono" style={{ fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
                ARS
              </span>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 22 }}>
              {p.desc}
            </p>

            {p.sizes && (
              <div style={{ marginTop: 26 }}>
                <div className="nh-label">Tamaño</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {p.sizes.map(s => (
                    <button key={s}
                      onClick={() => setSize(s)}
                      className={`nh-filter ${size === s ? 'is-active' : ''}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {p.frame && (
              <label style={{
                display: 'flex', alignItems: 'center', gap: 12, marginTop: 22,
                padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 4,
                cursor: 'pointer', background: frame ? 'var(--sage-200)' : 'transparent',
                transition: 'all 200ms var(--ease)',
              }}>
                <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)}
                  style={{ accentColor: 'var(--sage-700)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Sumar marco de roble</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                    Marco artesanal con vidrio antirreflejo · +{ARS(12000)}
                  </div>
                </div>
              </label>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={handleAdd} className="nh-btn nh-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {added ? '✓ Agregado' : 'Agregar al carrito'}
              </button>
              <button className="nh-btn nh-btn-ghost" style={{ padding: '14px 16px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14s-6-4-6-8a3.5 3.5 0 016-2.5A3.5 3.5 0 0114 6c0 4-6 8-6 8z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </button>
            </div>

            {/* Specs */}
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              {[
                ['Técnica', p.medium],
                ['Medidas', p.size],
                ['Edición', p.edition],
                ['Envío', 'Todo el país · 3-6 días hábiles'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr',
                  padding: '12px 0', borderBottom: '1px solid var(--line-soft)',
                  fontSize: 13,
                }}>
                  <div className="nh-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-soft)', paddingTop: 2 }}>{k}</div>
                  <div style={{ color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: isMobile ? '60px 22px 20px' : '120px 48px 40px' }}>
          <div style={{ marginBottom: 24 }}>
            <div className="nh-eyebrow">En la misma técnica</div>
            <h2 className="nh-serif" style={{ fontSize: isMobile ? 24 : 34, margin: '8px 0 0', fontWeight: 400 }}>
              También te puede interesar
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : `repeat(${related.length}, 1fr)`,
            gap: isMobile ? 16 : 28,
          }}>
            {related.map(r => <NHProductCard key={r.slug} product={r} go={go} onAdd={onAdd} compact={isMobile} />)}
          </div>
        </section>
      )}
    </div>
  );
}

Object.assign(window, { NHHome, NHTienda, NHProduct, ARS });
