// Natalia Heller — Estudio + Contacto pages

// ═══════════════════ ESTUDIO ═══════════════════
function NHEstudio({ go, isMobile }) {
  const [bookStep, setBookStep] = React.useState(0); // 0 form, 1 sent
  const [form, setForm] = React.useState({ name: '', email: '', area: '', size: '', idea: '' });
  const [errs, setErrs] = React.useState({});
  const pad = isMobile ? '22px' : '48px';

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Necesito saber cómo llamarte.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Revisá el correo.';
    if (!form.area) e.area = 'Indicá la zona del cuerpo.';
    if (!form.idea.trim() || form.idea.trim().length < 20) e.idea = 'Contame un poco más (mín. 20 caracteres).';
    setErrs(e);
    if (Object.keys(e).length === 0) setBookStep(1);
  };

  return (
    <div className="nh-page-enter">
      {/* Hero */}
      <section style={{ padding: isMobile ? '28px 22px 40px' : '60px 48px 72px', position: 'relative' }}>
        <div className="nh-motif" style={{ position: 'absolute', top: isMobile ? 20 : 50, right: isMobile ? 22 : 48, color: 'var(--sage-500)' }}>
          <NHLeafMark size={isMobile ? 44 : 64} />
        </div>
        <div className="nh-eyebrow" style={{ marginBottom: 16 }}>Estudio de tatuaje</div>
        <h1 className="nh-serif" style={{
          fontSize: isMobile ? 40 : 84, margin: 0, fontWeight: 400,
          letterSpacing: '-0.02em', lineHeight: 1.02,
          maxWidth: 1000,
        }}>
          Línea fina, botánica <span style={{ fontStyle: 'italic', color: 'var(--sage-700)' }}>y una conversación lenta</span>.
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 620, marginTop: 24 }}>
          Trabajo desde 2019 tatuando piezas dibujadas específicamente para cada persona.
          El estudio es chiquito, privado y tranquilo. Mate, música y el tiempo que haga falta.
        </p>
      </section>

      {/* Masonry gallery */}
      <section style={{ padding: `0 ${pad}`, marginTop: 8 }}>
        <div style={{
          columnCount: isMobile ? 2 : 4,
          columnGap: isMobile ? 10 : 16,
        }}>
          {NH_TATTOOS.map((t, i) => (
            <div key={i} className="nh-hover-lift" style={{ breakInside: 'avoid', marginBottom: isMobile ? 10 : 16, position: 'relative' }}>
              <NHPh tone={t.tone} tall={t.tall} label={`${t.label}\n${t.kind}`} />
              <div style={{
                position: 'absolute', bottom: 8, left: 8,
                background: 'rgba(253, 252, 251, 0.92)',
                padding: '4px 8px', fontSize: 9,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                color: 'var(--sage-700)',
              }}>
                {t.label.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ margin: isMobile ? '60px 0 40px' : '120px 0 60px' }}>
        <NHDivider label="el proceso" />
      </div>

      {/* Process */}
      <section style={{ padding: `0 ${pad}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? 28 : 32,
        }}>
          {[
            ['01', 'Conversamos', 'Me contás la idea por el formulario. Te respondo en 3-5 días con preguntas.'],
            ['02', 'Diseño', 'Dibujo una propuesta única, inspirada en tu historia. Iteramos hasta que encaje.'],
            ['03', 'Sesión', 'Nos encontramos en el estudio. Empezamos sin apuro, con mate y música suave.'],
            ['04', 'Cuidado', 'Te acompaño en la cicatrización con una guía clara y seguimiento.'],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="nh-serif" style={{ fontSize: 56, color: 'var(--sage-500)', lineHeight: 1, marginBottom: 12, fontStyle: 'italic' }}>
                {n}
              </div>
              <h3 className="nh-serif" style={{ fontSize: 22, margin: 0, fontWeight: 500 }}>{t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 10 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + booking form */}
      <section style={{ padding: isMobile ? '80px 22px 40px' : '140px 48px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 80,
        }}>
          {/* FAQ */}
          <div>
            <div className="nh-eyebrow" style={{ marginBottom: 12 }}>Antes de escribir</div>
            <h2 className="nh-serif" style={{ fontSize: isMobile ? 30 : 42, margin: 0, fontWeight: 400, letterSpacing: '-0.02em' }}>
              Cosas que suelen preguntar
            </h2>
            <div style={{ marginTop: 28 }}>
              {[
                ['¿Cuánto tarda en agendarse?', 'Abro agenda cada dos meses. Los cupos se llenan rápido; te aviso por mail si hay lugar.'],
                ['¿Cuál es el mínimo?', 'La sesión empieza en $45.000 ARS e incluye diseño, materiales y el tiempo de consulta.'],
                ['¿Viajás para trabajar?', 'Hago guest spots un par de veces al año. Anotate al newsletter para enterarte.'],
                ['¿Hacés tapados o coberturas?', 'Depende de cada caso. Mandame fotos y lo conversamos.'],
              ].map(([q, a], i) => <NHFaq key={i} q={q} a={a} />)}
            </div>
          </div>

          {/* Booking form */}
          <div id="book" style={{
            background: 'var(--cream-50)', padding: isMobile ? 24 : 36,
            borderRadius: 6, border: '1px solid var(--line-soft)',
            boxShadow: '0 8px 28px rgba(74, 124, 89, 0.06)',
          }}>
            {bookStep === 0 ? (
              <React.Fragment>
                <div className="nh-eyebrow" style={{ marginBottom: 10 }}>Reservar sesión</div>
                <h3 className="nh-serif" style={{ fontSize: 26, margin: 0, fontWeight: 400 }}>Contame tu idea</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, marginBottom: 24, lineHeight: 1.6 }}>
                  Respondo en 3 a 5 días. Todo lo que me cuentes queda entre nosotras.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label className="nh-label">Tu nombre</label>
                  <input className="nh-input" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Cómo querés que te llame" />
                  {errs.name && <div className="nh-error">{errs.name}</div>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="nh-label">Correo</label>
                  <input className="nh-input" value={form.email} type="email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vos@correo.com" />
                  {errs.email && <div className="nh-error">{errs.email}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label className="nh-label">Zona del cuerpo</label>
                    <select className="nh-select" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
                      <option value="">Elegí una</option>
                      <option>Brazo / antebrazo</option>
                      <option>Pierna</option>
                      <option>Espalda</option>
                      <option>Pecho / esternón</option>
                      <option>Otra</option>
                    </select>
                    {errs.area && <div className="nh-error">{errs.area}</div>}
                  </div>
                  <div>
                    <label className="nh-label">Tamaño aprox.</label>
                    <select className="nh-select" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                      <option value="">A elegir</option>
                      <option>Pequeño (~5 cm)</option>
                      <option>Mediano (10 cm)</option>
                      <option>Grande (15 cm+)</option>
                      <option>No lo sé todavía</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="nh-label">Contame la idea</label>
                  <textarea className="nh-textarea" value={form.idea}
                    onChange={(e) => setForm({ ...form, idea: e.target.value })}
                    placeholder="Referencias, sentimientos, historia atrás. Lo que quieras compartir."
                    rows={5}></textarea>
                  {errs.idea && <div className="nh-error">{errs.idea}</div>}
                </div>

                <button className="nh-btn nh-btn-primary" onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>
                  Enviar propuesta
                </button>
              </React.Fragment>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div className="nh-motif" style={{ marginBottom: 20, color: 'var(--sage-500)', display: 'flex', justifyContent: 'center' }}>
                  <NHLeafMark size={48} />
                </div>
                <h3 className="nh-serif" style={{ fontSize: 28, margin: 0, fontWeight: 400 }}>Llegó tu mensaje</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.7 }}>
                  Gracias, {form.name.split(' ')[0]}. Te voy a contestar en los próximos días desde <span style={{ color: 'var(--sage-700)' }}>hola@nataliaheller.ar</span>. Mientras tanto, respirá hondo ✶
                </p>
                <button className="nh-btn nh-btn-ghost" style={{ marginTop: 24 }}
                  onClick={() => { setBookStep(0); setForm({ name:'', email:'', area:'', size:'', idea:'' }); }}>
                  Enviar otra
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function NHFaq({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
      <button onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)',
          textAlign: 'left',
        }}>
        {q}
        <span style={{ color: 'var(--sage-700)', fontSize: 20, fontWeight: 300, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 200ms var(--ease)' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 10, marginBottom: 4 }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ═══════════════════ CONTACTO ═══════════════════
function NHContacto({ isMobile }) {
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'obra', msg: '' });
  const [errs, setErrs] = React.useState({});
  const [sent, setSent] = React.useState(false);
  const pad = isMobile ? '22px' : '48px';

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Tu nombre, por favor.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo no válido.';
    if (!form.msg.trim() || form.msg.length < 10) e.msg = 'Escribí un mensaje más largo.';
    setErrs(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  return (
    <div className="nh-page-enter">
      <section style={{
        padding: isMobile ? '28px 22px 60px' : '72px 48px 120px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 96,
        }}>
          <div>
            <div className="nh-eyebrow" style={{ marginBottom: 16 }}>Escribime</div>
            <h1 className="nh-serif" style={{
              fontSize: isMobile ? 40 : 72, margin: 0, fontWeight: 400,
              letterSpacing: '-0.02em', lineHeight: 1.02,
            }}>
              Las buenas <span style={{ fontStyle: 'italic', color: 'var(--sage-700)' }}>conversaciones</span> empiezan así.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 24, maxWidth: 440 }}>
              Podés escribirme por obra, encargos personalizados, colaboraciones o para
              saludar. Contesto de a poco pero contesto todo.
            </p>

            <div style={{ marginTop: 40, display: 'grid', gap: 22 }}>
              {[
                ['Correo', 'hola@nataliaheller.ar'],
                ['Instagram', '@nataliaceller_art'],
                ['Estudio', 'Desde el estudio · CABA\nCon turno previo'],
                ['Horario', 'Mar a Sáb · 11:00 — 19:00'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="nh-eyebrow-ink">{k}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginTop: 4, whiteSpace: 'pre-line' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--cream-50)', padding: isMobile ? 24 : 40,
            borderRadius: 6, border: '1px solid var(--line-soft)',
            boxShadow: '0 10px 30px rgba(74, 124, 89, 0.06)',
            alignSelf: 'start',
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--sage-500)', marginBottom: 16 }}>
                  <NHLeafMark size={42} />
                </div>
                <h3 className="nh-serif" style={{ fontSize: 26, margin: 0, fontWeight: 400 }}>Gracias {form.name.split(' ')[0]}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
                  Tu mensaje llegó. Te respondo con calma desde hola@nataliaheller.ar.
                </p>
                <button className="nh-btn nh-btn-ghost" style={{ marginTop: 20 }}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', topic: 'obra', msg: '' }); }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <React.Fragment>
                <h3 className="nh-serif" style={{ fontSize: 26, margin: 0, fontWeight: 400 }}>Enviame un mensaje</h3>

                <div style={{ marginTop: 24, display: 'grid', gap: 20 }}>
                  <div>
                    <label className="nh-label">Nombre</label>
                    <input className="nh-input" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {errs.name && <div className="nh-error">{errs.name}</div>}
                  </div>
                  <div>
                    <label className="nh-label">Correo</label>
                    <input className="nh-input" type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errs.email && <div className="nh-error">{errs.email}</div>}
                  </div>
                  <div>
                    <label className="nh-label">Motivo</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {[['obra','Obra / encargos'],['tatuaje','Tatuaje'],['colaboracion','Colaboración'],['otro','Otro']].map(([v, l]) => (
                        <button key={v} type="button"
                          className={`nh-filter ${form.topic === v ? 'is-active' : ''}`}
                          onClick={() => setForm({ ...form, topic: v })}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="nh-label">Mensaje</label>
                    <textarea className="nh-textarea" value={form.msg}
                      onChange={(e) => setForm({ ...form, msg: e.target.value })} rows={5} />
                    {errs.msg && <div className="nh-error">{errs.msg}</div>}
                  </div>
                  <button className="nh-btn nh-btn-primary" onClick={submit} style={{ justifyContent: 'center' }}>
                    Enviar mensaje
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { NHEstudio, NHContacto, NHFaq });
