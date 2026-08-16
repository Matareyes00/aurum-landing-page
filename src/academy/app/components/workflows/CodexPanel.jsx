import { useMemo, useState } from 'react'
import { IconSearch } from '../../icons'
import { useCopy, CODEX_PANEL, CODEX_TEXT } from '../../copy'

export default function CodexPanel({ tags, selectedId, onSelect, counts = {} }) {
  const t = useCopy(CODEX_PANEL)
  const codexText = useCopy(CODEX_TEXT)
  const [query, setQuery] = useState('')

  /** Texto del tag en el idioma activo; si falta, el que quedó guardado. */
  const textFor = (tag) => codexText[tag.id] ?? [tag.definition, tag.useWhen, tag.doNotUseWhen]

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return tags
    return tags.filter((tag) => [tag.label, tag.category, ...textFor(tag)].some((value) => value?.toLowerCase().includes(needle)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tags, codexText])

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
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />
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
        {!filtered.length ? <p className="wf-muted">{t.empty}</p> : null}
      </div>
      {selected ? (
        <div className="codex-detail">
          <span>{selected.category}</span>
          <h3>{selected.label}</h3>
          <dl>
            <div><dt>{t.definition}</dt><dd>{textFor(selected)[0]}</dd></div>
            <div><dt>{t.useWhen}</dt><dd>{textFor(selected)[1]}</dd></div>
            <div><dt>{t.doNotUseWhen}</dt><dd>{textFor(selected)[2]}</dd></div>
          </dl>
        </div>
      ) : null}
    </div>
  )
}
