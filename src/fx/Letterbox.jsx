import { useEffect, useState } from 'react'

export default function Letterbox() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onToggle = (e) => {
      if (window.innerWidth < 900) return
      setActive(!!e.detail)
    }
    window.addEventListener('aurum:letterbox', onToggle)
    return () => window.removeEventListener('aurum:letterbox', onToggle)
  }, [])

  return (
    <>
      <div className={`lbox lbox--top ${active ? 'is-in' : ''}`} aria-hidden="true" />
      <div className={`lbox lbox--bottom ${active ? 'is-in' : ''}`} aria-hidden="true" />
    </>
  )
}
