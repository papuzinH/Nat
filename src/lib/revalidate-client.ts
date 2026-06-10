import { pb } from '@/lib/pocketbase'

// Dispara la revalidación on-demand del ISR desde el admin (browser) tras
// guardar/publicar. Autoriza con el token de superuser de PocketBase. Falla en
// silencio: la revalidación no debe bloquear el flujo de guardado.
export async function triggerRevalidate(tag: 'products' | 'blog_posts'): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: pb.authStore.token,
      },
      body: JSON.stringify({ tag }),
    })
  } catch {
    /* no crítico */
  }
}
