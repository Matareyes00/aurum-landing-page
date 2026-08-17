# Aurum Academy — Plan por fases

Estado del portal Academy (`src/academy/`) y del trabajo pendiente, organizado
por fases. Este archivo se actualiza a medida que avanza cada fase.

**Última actualización:** 2026-08-16

---

## Contexto

El Console de evaluación vivía en el repo `aurum-brain` (Next.js). La decisión
fue migrarlo al portal Academy de esta landing (SPA Vite + React, sin
TypeScript, persistencia en `localStorage`). La capa de workflows ya está
migrada y verificada; lo que queda pertenece al contenido editorial o al roadmap
de producción, no a la interacción base de los workflows.

### Decisión tomada sobre `aurum-brain`

Los cambios P0/P1/P2 de `aurum-brain` se verificaron y quedaron guardados en el
commit `e7a20af`. Al haberse migrado el Console al Academy, ese repo queda como
referencia técnica; el desarrollo de producto de workflows continúa acá.

- [x] Verificar y commitear el cierre técnico de `aurum-brain`
- [x] Congelar allí el desarrollo de workflows y usarlo sólo como referencia

---

## Fase 1 — Neutralidad de datos ✅ COMPLETA

Objetivo: que ninguna respuesta venga precargada. El `0`, `"low"` o
`"fulfilled"` siguen siendo válidos, pero sólo después de una acción explícita.

### Valores por defecto
- [x] `single_video_qc` y `style_consistency`: `scores[].score` de `0` → `null`
- [x] `prompt_adherence`: `items[].status` de `'fulfilled'` → `null`
- [x] `audio_visual_sync`: `offsetMs` y `markerSec` de `0` → `null`
- [x] `physics_behavior`: `severity` de `'medium'` → `null`
- [x] `safety_compliance`: `level` de `'low'` → `null`
- [x] `adversarial_red_team`: `severity` y `reproducibility` → `null`
- [x] Transiciones de continuidad: `status: 'pass'` y `severity: 'low'` → `null`
- [x] Eventos temporales: `confidence: 'high'` → `null`
- [x] Diálogo de issues: `severity` y `confidence` arrancan sin responder

### Validación de envío
- [x] Helper `answered()` — `0` cuenta como respuesta, `null`/`''` no
- [x] QC y estilo: exigen veredicto + todas las dimensiones puntuadas
- [x] Adherencia: exige estado en cada elemento del prompt
- [x] Continuidad: exige estado en cada transición
- [x] Audio-sync: exige decisión + offset medido
- [x] Física: exige decisión + severidad + esperado/observado
- [x] Safety: exige decisión + nivel de riesgo
- [x] Red team: exige escenario, modo de falla, severidad y reproducibilidad
- [x] A/B: exige justificación observable *(confirmar si debe seguir siendo opcional)*

### Interfaz
- [x] Los `select` normalizan `null` → muestran «Seleccionar…»
- [x] Indicador «sin responder» en dimensiones y campos pendientes
- [x] Campos numéricos con placeholder en vez de `0`

### Tests
- [x] Ningún workflow arranca con respuestas precargadas
- [x] Los diez rechazan un envío vacío
- [x] El `0` vale en QC sólo después de elegirlo
- [x] Safety exige nivel de riesgo explícito

---

## Fase 2 — Idioma ES/EN ✅ COMPLETA (salvo 2 puntos)

Objetivo: portal bilingüe con el mismo patrón `useLang`/`useCopy` de la landing,
sin dependencias nuevas. Cierra el punto 3 de `ACADEMY-PENDIENTES.md`.

### Infraestructura
- [x] `src/academy/app/copy/index.js` — reexporta el store de idioma compartido
- [x] `src/academy/app/copy/portal.js` — 10 diccionarios del chrome
- [x] `src/academy/app/copy/workflows.js` — 13 diccionarios de la mesa de evaluación
- [x] Selector `LangSwitch` (ES/EN) en la barra del portal y en el login
- [x] Estilos del selector en `portal.css`
- [x] Test de paridad: mismas claves en `es` y `en` en todos los diccionarios

### Chrome del portal
- [x] `Shell.jsx` — navegación, menú de usuario, estado de guardado
- [x] `Login.jsx` — formulario, accesos demo y errores
- [x] `auth.js` — devuelve códigos de error en vez de texto
- [x] `HomeView.jsx`
- [x] `CoursesView.jsx` y `CourseCard.jsx`
- [x] `ProfileView.jsx`
- [x] `AdminView.jsx`
- [x] `CoursePlayer.jsx` — incluye comprobación y pantalla de cierre
- [x] `Certificate.jsx`

### Mesa de evaluación
- [x] `WorkflowQueue.jsx`
- [x] `WorkflowWorkspace.jsx`
- [x] `WorkflowForm.jsx` — los diez formularios y sus enums
- [x] `IssueDialog.jsx` y el editor de bbox
- [x] `VideoWorkbench.jsx` — controles y etiquetas accesibles
- [x] `CodexPanel.jsx` y `CodexView.jsx`

### Dominio
- [x] `validateEvaluation` devuelve códigos; la traducción vive en `VALIDATION`
- [x] Taglines de los diez workflows en ES/EN
- [x] Texto de los 20 tags del Codex en ES/EN, con fallback al texto guardado
- [x] Razones principales traducidas por clave (no rompe evaluaciones guardadas)
- [x] Términos técnicos sin traducir: workflow, Codex, ranking, bbox, training signal

### Pendiente de la Fase 2
- [x] `AdminHub.jsx` — diccionario `ADMIN_HUB` con los ~70 textos del panel interno
- [ ] Contenido de los cursos (`COURSES` en `data.js`, ~240 líneas) — hoy sólo español
      *(editorial: conviene que lo escriba el equipo, no una traducción automática)*

---

## Fase 3 — Responsive mobile ✅ COMPLETA

Objetivo: los diez workflows y todo el portal usables a 390 px.

### Correcciones aplicadas
- [x] `.output-editor` colapsa a 1 columna desde 860 px (antes se quedaba en 4 hasta 620 px)
- [x] Barra de video partida en dos: transporte principal + `.frame-tools` plegable
- [x] Botón «Herramientas / Tools» sólo visible ≤ 620 px, con `aria-expanded` y `aria-controls`
- [x] En desktop las herramientas avanzadas siguen siempre visibles (sin cambio de layout)
- [x] Targets táctiles de 44 px: barra de frames, chips de scoring, segmented, Codex,
      acciones de review, botón de issue, marcadores de timeline
- [x] Timeline a 44 px de alto con marcadores más grandes (6 × 20 px)
- [x] Backdrop en el drawer del Codex a ≤ 860 px, cierra al tocar fuera
- [x] El drawer del Codex se alinea con la topbar reducida a ≤ 620 px
- [x] `In` / `Out` / `Loop` con `title`, `aria-label` y `aria-pressed`
- [x] Botón de issue traducido (`t.addIssueOn`), era el último texto fijo del workbench

### Breakpoint nuevo ≤ 430 px
- [x] `workflows.css`: cola, brief, panes de video, formularios, export y modales
- [x] Modal de issues a pantalla completa (sin bordes ni radio) en teléfonos chicos
- [x] `.workflow-actions` a una sola columna
- [x] `export-preview pre` con `white-space: pre-wrap` para evitar scroll horizontal
- [x] `portal.css`: hero, tarjetas de curso, mapa del curso, lector, quiz, modal de cierre
- [x] Certificado ajustado a 390 px

### Portal
- [x] `.pnav-link` con ancho mínimo de 44 px
- [x] `.course-map` limitado a 34 vh (30 vh en ≤ 430) para que el lector quede visible
- [x] `.reader-footer` envuelve y los botones ocupan el ancho disponible
- [x] `.modnav-item` y `.quiz-option` a 48 px

### Pendiente de la Fase 3
- [x] Recorrido real automatizado a 390 px de los diez workflows, sin overflow horizontal
- [x] El bottom sheet del Codex deja visible la barra de acciones y cierra desde el backdrop

---

## Fase 4 — Portar mejoras de UX del Console ✅ COMPLETA

Diseñado y probado en `aurum-brain`; ahora vive en el Academy en JSX.

### Etapas
- [x] `src/academy/app/stages.js` — modelo de cinco etapas
      (Contexto → Inspección → Anotación → Decisión → Revisión)
- [x] Estados por etapa: `done`, `todo` y `optional` (la anotación nunca bloquea)
- [x] `stageProgress()` cuenta sólo las etapas bloqueantes (4 de 5)
- [x] `StageStepper.jsx` — índice con progreso, estado y acceso directo
- [x] «Ir a lo que falta» salta a la primera etapa sin resolver
- [x] En desktop el stepper hace scroll a la sección; en mobile muestra una etapa por pantalla
- [x] `scroll-margin-top` para que la topbar sticky no tape el encabezado
- [x] La inspección se marca cumplida en la primera reproducción o búsqueda real

### Barra inferior en mobile
- [x] `EvaluationBottomBar.jsx` — guardado, progreso, anterior/siguiente, Codex y envío
- [x] Se oculta en desktop; las acciones siguen al pie del formulario
- [x] `.workflow-main` reserva espacio inferior para que no tape contenido

### Codex
- [x] Bottom sheet a ≤ 620 px (drawer lateral entre 620 y 860 px)
- [x] Accesible desde cualquier etapa por el botón de la barra inferior
- [x] Cierra con Escape y con el backdrop cuando está superpuesto

### Confirmación de envío
- [x] `SubmittedPanel.jsx` — resumen humano + «Siguiente tarea» + volver a la cola
- [x] `nextTaskForUser()` encadena con la próxima evaluación sin enviar
- [x] Si falla la validación, el envío salta a la etapa de Decisión con los errores

### Modales accesibles
- [x] `useFocusTrap.js` — foco atrapado, ciclado con Tab, Escape y bloqueo de scroll
- [x] Devuelve el foco al elemento que abrió el diálogo
- [x] Aplicado a `IssueDialog`

### Export y resumen
- [x] `summaryRows()` devuelve filas `{ key, value | enumValue }`, sin texto traducido
- [x] `EvaluationSummary.jsx` traduce etiquetas y enums en el momento de pintar
- [x] Resumen humano antes del JSON; el JSON sigue colapsado en un `<details>`

### A/B en mobile
- [x] Selector de output persistente sobre el reproductor
- [x] A ≤ 860 px se muestra un output por vez, con los dos videos sincronizados

### Tests
- [x] Etapas: estados, progreso y primera etapa pendiente
- [x] Orden documentado de las cinco etapas
- [x] Resumen humano traducible en los diez workflows

### Pendiente de la Fase 4
- [x] Recorrido completo verificado en navegador sobre el build de producción
- [x] El foco vuelve al botón que abrió el diálogo de issues al cerrarlo con Escape

---

## Fase 5 — Contenido y cierre ✅ COMPLETA PARA EL MVP

### Idioma del panel de gestión
- [x] `ADMIN_HUB` en `copy/portal.js` — pestañas, personas, workflows, tareas, Codex y resultados
- [x] La nota de «pedir cambios» y el estado «pendiente de revisión» salen del diccionario
- [x] Las fechas de resultados usan el locale del idioma activo (`es-AR` / `en-US`)
- [x] Barrido final: no queda español fijo en ningún `.jsx` de `components/`

### Material demo
- [x] Migrado el host de los clips: `interactive-examples.mdn.mozilla.net` está
      descontinuado → `mdn.github.io/shared-assets` (verificado: 200 y `ACAO: *`,
      que es lo que necesita `crossOrigin="anonymous"` para capturar frames)
- [x] Consigna propia por workflow (`BRIEFS` en `storage.js`): prompt, objetivo y
      prioridad distintos en las diez tareas, en vez de un texto genérico repetido
- [x] A/B compara dos clips distintos — antes eran el mismo video dos veces
- [x] Continuidad usa tres clips con un corte que rompe la escena a propósito
- [x] Las tareas de safety y red team se declaran como simulacro sobre material benigno
- [x] Test: cada tarea tiene objetivo propio, A/B trae fuentes distintas y nadie
      apunta al host viejo

### Modo N-way — entra
- [x] `RankingPicker` en `WorkflowForm.jsx`: se ordenan los outputs tocando de mejor a peor
- [x] El primero elegido queda como `preferredOutputId`, así A/B y N-way exportan igual
- [x] `result.ranking` arranca vacío (sin respuesta precargada, como la Fase 1)
- [x] Validación `ranking_required`: cubre todos los outputs y sin posiciones repetidas
- [x] El resumen humano muestra el ranking como `A > B > C`
- [x] Estilos con targets de 44 px en mobile
- [x] Test de A/B vs N-way, ranking incompleto y con repetidos

### Documentación
- [x] `ACADEMY-PENDIENTES.md`: punto 3 (portal bilingüe) cerrado, con la salvedad
      del contenido de los cursos

### Pendiente de la Fase 5
- [x] Dependencias instaladas y `npm run test`: 22/22 tests
- [x] Revisión automatizada a 390 px de los diez workflows
- [ ] Reemplazar los clips CC0 por material propio de Aurum cuando exista
- [ ] Traducir el contenido editorial de los cursos

---

## Verificación ejecutada

Última pasada: 2026-08-16.

- [x] `npm test` — 22/22 tests
- [x] `npm run build` — build de producción correcto
- [x] `npm audit` — 0 vulnerabilidades conocidas
- [x] `npm run verify:academy` — desktop, tablet y mobile sin overflow
- [x] Los diez workflows montan workbench y formulario a 390 px
- [x] Video A/B, Codex, issue con bbox, cierre por backdrop y retorno de foco
- [x] Colas de alumno y Gestión contienen las diez tareas esperadas
- [ ] Smoke manual del cambio de idioma entre recargas y pestañas
- [ ] Crear una tarea N-way desde Gestión y evaluarla de punta a punta

---

## Fuera de alcance (sigue pendiente del MVP)

Del `ACADEMY-PENDIENTES.md` original, esto no lo toca ninguna fase:

- Autenticación real (hoy usuario/contraseña en texto plano — **no usar en producción**)
- Backend y base de datos (hoy todo en `localStorage`)
- Constructor de cursos para el admin
- Validación pública de certificados por URL
