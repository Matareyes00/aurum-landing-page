import { useMemo, useState } from 'react'
import { IconSearch } from '../../icons'

export default function CodexPanel({ tags, selectedId, onSelect, counts = {} }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return tags
    return tags.filter((tag) => [tag.label, tag.category, tag.definition].some((value) => value.toLowerCase().includes(needle)))
  }, [query, tags])

  const groups = useMemo(() => filtered.reduce((result, tag) => {
    result[tag.category] ||= []
    result[tag.category].push(tag)
    return result
  }, {}), [filtered])

  const selected = tags.find((tag) => tag.id === selectedId)

  return (
    <div className="codex-panel">
      <label className="codex-search">
        <IconSearch size={15} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tag o categoría" />
      </label>
      <div className="codex-groups">
        {Object.entries(groups).map(([category, entries]) => (
          <section className="codex-group" key={category}>
            <h3>{category}</h3>
            {entries.map((tag) => (
              <button
                className={`codex-tag ${selectedId === tag.id ? 'is-selected' : ''}`}
                key={tag.id}
                type="button"
                onClick={() => onSelect?.(tag)}
              >
                <span>{tag.label}</span>
                {counts[tag.id] ? <small>×{counts[tag.id]}</small> : null}
              </button>
            ))}
          </section>
        ))}
        {!filtered.length ? <p className="wf-muted">Sin resultados.</p> : null}
      </div>
      {selected ? (
        <div className="codex-detail">
          <span>{selected.category}</span>
          <h3>{selected.label}</h3>
          <dl>
            <div><dt>Definición</dt><dd>{selected.definition}</dd></div>
            <div><dt>Usar cuando</dt><dd>{selected.useWhen}</dd></div>
            <div><dt>No usar cuando</dt><dd>{selected.doNotUseWhen}</dd></div>
          </dl>
        </div>
      ) : null}
    </div>
  )
}
