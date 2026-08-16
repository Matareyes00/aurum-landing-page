import { useState } from 'react'
import { useDb } from '../../store'
import { Eyebrow } from '../ui'
import CodexPanel from './CodexPanel'
import { useCopy, CODEX_VIEW } from '../../copy'

export default function CodexView() {
  const db = useDb()
  const t = useCopy(CODEX_VIEW)
  const [selected, setSelected] = useState(db.codex.tags[0]?.id || null)
  return <div className="view codex-view">
    <header className="view-hero"><Eyebrow>{t.eyebrow} · {db.codex.version}</Eyebrow><h1 className="view-title">Aurum Codex</h1><p className="view-lede">{t.lede}</p></header>
    <div className="codex-library"><CodexPanel tags={db.codex.tags} selectedId={selected} onSelect={(tag) => setSelected(tag.id)} /></div>
  </div>
}
