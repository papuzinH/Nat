import { useCallback, useEffect } from 'react'

/**
 * Protege contra pérdida de cambios sin guardar.
 *
 * - `beforeunload`: cubre refresh / cerrar tab / cerrar browser.
 * - `confirmExit()`: helper para envolver navegación interna (botones "← Volver",
 *   links que disparan navigate()). El proyecto usa BrowserRouter legacy, no Data
 *   Router, así que `useBlocker` de RR7 no aplica.
 */
export function useUnsavedWarning(
  dirty: boolean,
  message = '¿Salir sin guardar? Se perderán los cambios.',
) {
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, message])

  const confirmExit = useCallback((): boolean => {
    if (!dirty) return true
    return window.confirm(message)
  }, [dirty, message])

  return { confirmExit }
}
