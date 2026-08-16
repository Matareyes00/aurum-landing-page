/**
 * Punto de entrada de i18n del portal Academy.
 *
 * Reutiliza el store de idioma de la landing (`src/i18n`), así el portal y la
 * página pública comparten la preferencia guardada en `localStorage` y el
 * `<html lang>` queda siempre sincronizado.
 *
 * Los diccionarios viven separados por área para que cada componente importe
 * sólo lo suyo:
 *   - `portal.js`    → chrome, cursos, perfil, gestión, certificado
 *   - `workflows.js` → mesa de evaluación, Codex y mensajes de validación
 */
export { useLang, useCopy, getLang, setLang, toggleLang } from '../../../i18n'

export * from './portal'
export * from './workflows'
