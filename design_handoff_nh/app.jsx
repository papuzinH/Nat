// Natalia Heller — App shell: cart, nav state, routing, tweaks

function NHApp({ variant }) {
  const isMobile = variant === 'mobile';
  const storageKey = `nh-state-${variant}`;

  // Load persisted route
  const loadRoute = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return saved.route || { page: 'home' };
    } catch { return { page: 'home' }; }
  };

  const [route, setRoute] = React.useState(loadRoute);
  const [cart, setCart] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ route }));
    // scroll container to top on route change
    const scroller = document.querySelector(`[data-scroll-${variant}]`);
    if (scroller) scroller.scrollTop = 0;
  }, [route]);

  const go = (r) => setRoute(r);

  const onAdd = (item) => {
    setCart((c) => {
      const existing = c.find((x) => x.slug === item.slug && x.size === item.size && x.frame === item.frame);
      if (existing) {
        return c.map((x) => x === existing ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...c, { ...item, qty: 1 }];
    });
    setToast(`${item.title} · agregado`);
    setTimeout(() => setToast(null), 2200);
  };

  const removeItem = (idx) => {
    setCart((c) => c.filter((_, i) => i !== idx));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let page;
  switch (route.page) {
    case 'tienda':   page = <NHTienda go={go} onAdd={onAdd} isMobile={isMobile} />; break;
    case 'product':  page = <NHProduct slug={route.slug} go={go} onAdd={onAdd} isMobile={isMobile} />; break;
    case 'estudio':  page = <NHEstudio go={go} isMobile={isMobile} />; break;
    case 'blog':     page = <NHBlog go={go} isMobile={isMobile} />; break;
    case 'post':     page = <NHPost slug={route.slug} go={go} isMobile={isMobile} />; break;
    case 'contacto': page = <NHContacto isMobile={isMobile} />; break;
    default:         page = <NHHome go={go} onAdd={onAdd} isMobile={isMobile} />;
  }

  return (
    <div className="nh-root" style={{ minHeight: '100%', position: 'relative' }}>
      <NHHeader route={route} go={(r) => { go(r); setCartOpen(false); }}
        cartCount={cartCount} openCart={() => setCartOpen(true)} variant={variant} />

      <main>{page}</main>

      <NHFooter go={go} variant={variant} />

      {/* Cart drawer */}
      <div className={`nh-backdrop ${cartOpen ? 'is-open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`nh-drawer ${cartOpen ? 'is-open' : ''}`} style={{ width: isMobile ? '86%' : 380 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '22px 24px', borderBottom: '1px solid var(--line-soft)',
        }}>
          <div>
            <div className="nh-eyebrow">Tu carrito</div>
            <h3 className="nh-serif" style={{ fontSize: 22, margin: '4px 0 0', fontWeight: 400 }}>
              {cartCount === 0 ? 'Vacío por ahora' : `${cartCount} pieza${cartCount > 1 ? 's' : ''}`}
            </h3>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, color: 'var(--ink-soft)', padding: 4,
          }}>×</button>
        </div>

        <div className="nh-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ color: 'var(--sage-500)', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <NHLeafMark size={36} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                Todavía no elegiste nada.<br/>
                <a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(false); go({ page: 'tienda' }); }} className="nh-link">
                  Ir a la tienda
                </a>
              </p>
            </div>
          ) : (
            cart.map((it, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 0',
                borderBottom: '1px solid var(--line-soft)',
              }}>
                <div style={{ width: 64, flexShrink: 0 }}>
                  <NHPh tone={it.tone} tall={1} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nh-serif" style={{ fontSize: 16, fontWeight: 500 }}>{it.title}</div>
                  <div className="nh-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {it.size ? `${it.size} · ` : ''}{it.frame ? 'con marco · ' : ''}x{it.qty}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span className="nh-mono" style={{ fontSize: 13, color: 'var(--sage-700)' }}>
                      {ARS(it.price * it.qty)}
                    </span>
                    <button onClick={() => removeItem(i)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>Quitar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line-soft)', background: 'var(--cream-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: 'var(--ink-soft)' }}>
              <span>Envío</span><span>A calcular</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="nh-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-soft)' }}>
                Subtotal
              </span>
              <span className="nh-serif" style={{ fontSize: 24, color: 'var(--sage-900)' }}>{ARS(cartTotal)}</span>
            </div>
            <button className="nh-btn nh-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
              Finalizar compra
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'var(--cream-50)',
          padding: '12px 22px', borderRadius: 999, fontSize: 13,
          fontFamily: 'var(--font-body)',
          boxShadow: '0 8px 24px rgba(44,44,44,0.2)', zIndex: 70,
          animation: 'nh-fade-up 300ms var(--ease) both',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { NHApp });
