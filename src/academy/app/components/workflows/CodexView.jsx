import { useState } from 'react'
import { useDb } from '../../store'
import { Eyebrow } from '../ui'
import CodexPanel from './CodexPanel'

export default function CodexView() {
  const db = useDb()
  const [selected, setSelected] = useState(db.codex.tags[0]?.id || null)
  return <div className="view codex-view">
    <header className="view-hero"><Eyebrow>Lenguaje compartido · {db.codex.version}</Eyebrow><h1 className="view-title">Aurum Codex</h1><p className="view-lede">La taxonomía para convertir observaciones visuales en evidencia consistente.</p></header>
    <div className="codex-library"><CodexPanel tags={db.codex.tags} selectedId={selected} onSelect={(tag) => setSelected(tag.id)} /></div>
  </div>
}
