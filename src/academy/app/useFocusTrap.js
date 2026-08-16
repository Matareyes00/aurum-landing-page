import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Atrapa el foco dentro de un contenedor mientras está abierto, bloquea el
 * scroll del documento, cierra con Escape y devuelve el foco al elemento que
 * abrió el diálogo.
 *
 * @param {boolean} active
 * @param {() => void} onClose
 * @returns {import('react').RefObject<HTMLElement>} ref para el contenedor
 */
export function useFocusTrap(active, onClose) {
  const containerRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!active) return undefined
    const container = containerRef.current
    const previous = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const focusables = () => Array.from(container?.querySelectorAll(FOCUSABLE) || []).filter((node) => node.offsetParent !== null)
    const first = focusables()[0]
    if (first) first.focus()
    else container?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = focusables()
      if (!nodes.length) return
      const start = nodes[0]
      const end = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault()
        end.focus()
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault()
        start.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = overflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [active])

  return containerRef
}
