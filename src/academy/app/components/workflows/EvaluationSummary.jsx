import { summaryRows } from '../../evaluations'
import { useCopy, SUMMARY_LABELS, ENUM_LABELS, STAGE_UI } from '../../copy'

/** Resumen legible de la evaluación: mismas filas antes del envío y después. */
export default function EvaluationSummary({ task, evaluation }) {
  const labels = useCopy(SUMMARY_LABELS)
  const enumLabel = useCopy(ENUM_LABELS)
  const t = useCopy(STAGE_UI)
  const rows = summaryRows(task, evaluation)

  return (
    <div className="evaluation-summary">
      <span className="evaluation-summary-title">{t.summaryTitle}</span>
      <dl>
        {rows.map((row) => (
          <div key={row.key}>
            <dt>{labels[row.key] || row.key}</dt>
            <dd>{row.enumValue ? enumLabel[row.enumValue] || row.enumValue : String(row.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
