export default function Page() {
  return (
    <main className="min-h-screen bg-cream-100 text-ink p-12">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-sage-700">
        Wave 1 · estilos y fuentes
      </p>
      <h1 className="font-display text-4xl mt-4 text-ink">
        Natalia Heller — Arte Original
      </h1>
      <p className="font-body text-base mt-3 text-ink-soft max-w-prose">
        Andamiaje de migración a Next.js. Esta página valida Tailwind, los tokens
        de color (cream / sage / ink) y las fuentes vía <code>next/font</code>
        (Fraunces, Nunito, JetBrains Mono).
      </p>
      <div className="mt-8 flex gap-3">
        <span className="rounded-pill bg-sage-700 text-cream-50 px-4 py-2 text-sm">sage-700</span>
        <span className="rounded-pill bg-amber-400 text-ink px-4 py-2 text-sm">amber-400</span>
        <span className="rounded-card bg-cream-300 text-ink px-4 py-2 text-sm">cream-300</span>
      </div>
    </main>
  )
}
