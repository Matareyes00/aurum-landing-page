# Aurum Academy — Pendientes (para hacerlo mejor después)

Este archivo lista las decisiones tomadas como MVP/prototipo y lo que conviene
mejorar en una segunda etapa. La primera versión del portal ("El Aula") ya está
implementada en `src/academy/app/`.

## Contexto del MVP actual
- Portal en `/academy/app/` (entrada Vite propia), separado de la landing pública.
- Router por hash propio, autenticación mock e íconos SVG inline.
- Academy Workflows integra los 10 modos de evaluación, cola por evaluador, workspace
  de video, Codex, issues con bbox y consola operativa para administradores.
- `aurum-academy-db:v2` separa usuarios, asignaciones, progreso, configuración,
  tareas, evaluaciones y Codex. Migra automáticamente desde v1 y sincroniza pestañas.
- Los videos y capturas no se persisten en `localStorage`; las tareas guardan solo
  metadata y URLs CORS-safe. Los frames capturados existen únicamente en memoria.
- Vitest cubre storage, migración, validadores, exportadores y geometría de bbox
  (22 tests). El verificador de navegador recorre los diez workflows a 390 px,
  además de las vistas clave en tablet y desktop.

## Pendientes prioritarios

### 1. Autenticación real (seguridad)
- HOY: usuario/contraseña en texto plano en `src/academy/app/data.js`, sesión en
  `localStorage`. Es un prototipo — NO usar en producción.
- LUEGO: backend con auth real (Supabase Auth / Auth.js / Clerk), hash de contraseñas,
  tokens, recupero de contraseña, verificación de email, rate limiting del login.

### 2. Persistencia / backend
- HOY: `localStorage` (se pierde al limpiar el navegador; no se comparte entre
  dispositivos; el "admin" y el evaluador deben usar el mismo navegador). La capa
  `storage.js`/`store.js` evita que las vistas dependan directamente del adapter local.
- LUEGO: API y base de datos con users, courses, workflow assignments, tasks,
  evaluations, issues, reviews y Codex. Object storage para medios y uploads firmados.

### 3. Portal bilingüe (ES/EN) — [HECHO]
- HOY: el portal usa el mismo patrón `useLang`/`useCopy` de `src/i18n/`, con los
  diccionarios en `src/academy/app/copy/` (`portal.js` y `workflows.js`). Cubre
  login, shell, vistas, gestión, certificado y la mesa de evaluación completa.
  `validateEvaluation` y `login` devuelven códigos, no texto: la traducción vive
  en la interfaz y los tests no dependen del idioma.
- FALTA: el contenido editorial de los cursos (`COURSES` en `data.js`) sigue sólo
  en español. Ver Fase 5 en `ACADEMY-FASES.md`.

### 4. Autoría de cursos
- HOY: los cursos están escritos a mano en `src/academy/app/data.js` (2 cursos:
  "El Codex — Fundamentos" y "Workflow 01 — Preference Evaluation"). Los workflows,
  tareas, rúbricas y Codex sí tienen edición operativa desde Gestión.
- LUEGO: constructor de cursos para el admin (crear módulos, secciones, quizzes,
  subir videos/imágenes), o un CMS.

### 5. Certificados
- HOY: al completar un curso se genera una credencial visual con nombre, programa,
  fecha e ID determinístico. Se puede volver a abrir desde el perfil e imprimir o
  guardar como PDF.
- LUEGO: validación pública del ID mediante URL única, badge para LinkedIn, firma del
  lado servidor y conexión con la "red de evaluadores" (pool) para habilitar proyectos
  pagos.

## Mejoras menores / nice-to-have
- Roles más granulares (instructor, revisor) además de admin/student.
- Notificaciones cuando el equipo asigna un curso nuevo.
- Búsqueda y filtros en el catálogo cuando haya muchos cursos.
- [HECHO] Animaciones de transición entre vistas y modales, respetando
  `prefers-reduced-motion`.
- Métricas de avance para el admin (tiempo por módulo, tasa de aprobación del quiz).
- [HECHO] Recordar el último curso/módulo abierto al reingresar mediante el progreso
  persistido en `localStorage`.
- [HECHO] Polish visual del portal: superficies glass, luz reactiva al cursor,
  interacciones, login editorial, marca más legible y perfil con mayor jerarquía.

## Cómo probar el MVP
1. `npm ci`.
2. `npm test`.
3. `npm run verify:academy` (compila, levanta un preview temporal y recorre la UI).
4. Para exploración manual, `npm run dev`.
5. Ir a `/academy/app/`.
6. Login `admin / admin` → Gestión → asignar un curso a "Ana Ríos" (alumno).
7. Cerrar sesión → login `alumno / alumno` → Inicio muestra los cursos asignados.
8. Abrir un curso → los módulos se desbloquean al responder bien la comprobación →
   Finalizar → certificado → verlo en Perfil.
