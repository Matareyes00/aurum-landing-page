# Aurum Academy — Pendientes (para hacerlo mejor después)

Este archivo lista las decisiones tomadas como MVP/prototipo y lo que conviene
mejorar en una segunda etapa. La primera versión del portal ("El Aula") ya está
implementada en `src/academy/app/`.

## Contexto del MVP actual
- Portal en `/academy/app/` (entrada Vite propia), separado de la landing pública.
- Sin dependencias nuevas (el entorno no puede instalar): router por hash propio,
  auth mock, datos mock, íconos SVG inline.
- Todo el estado vive en `localStorage` del navegador.

## Pendientes prioritarios

### 1. Autenticación real (seguridad)
- HOY: usuario/contraseña en texto plano en `src/academy/app/data.js`, sesión en
  `localStorage`. Es un prototipo — NO usar en producción.
- LUEGO: backend con auth real (Supabase Auth / Auth.js / Clerk), hash de contraseñas,
  tokens, recupero de contraseña, verificación de email, rate limiting del login.

### 2. Persistencia / backend
- HOY: `localStorage` (se pierde al limpiar el navegador; no se comparte entre
  dispositivos; el "admin" y el "alumno" no ven lo mismo salvo en la misma máquina).
- LUEGO: base de datos (Supabase/Postgres) con tablas users, courses, modules,
  enrollments, progress. API para asignar cursos y guardar progreso del lado servidor.

### 3. Portal bilingüe (ES/EN)
- HOY: el portal está en español. La landing pública ya es bilingüe.
- LUEGO: aplicar el mismo patrón `useLang`/`useCopy` de `src/i18n/` al portal
  (login, shell, vistas y contenidos de curso).

### 4. Autoría de cursos
- HOY: los cursos están escritos a mano en `src/academy/app/data.js` (2 cursos:
  "El Codex — Fundamentos" y "Workflow 01 — Preference Evaluation").
- LUEGO: constructor de cursos para el admin (crear módulos, secciones, quizzes,
  subir videos/imágenes), o un CMS. Soporte para más tipos de sección (video, imagen
  anotable, ejercicio de evaluación real A/B con clips).

### 5. Certificados
- HOY: al completar un curso se muestra un "certificado" en pantalla y aparece en el
  perfil.
- LUEGO: certificado verificable (PDF/URL única), badge para LinkedIn, y conexión con
  la "red de evaluadores" (pool) para habilitar proyectos pagos.

## Mejoras menores / nice-to-have
- Roles más granulares (instructor, revisor) además de admin/student.
- Notificaciones cuando el equipo asigna un curso nuevo.
- Búsqueda y filtros en el catálogo cuando haya muchos cursos.
- Estados de carga/animaciones de transición entre vistas (GSAP), respetando
  `prefers-reduced-motion`.
- Métricas de avance para el admin (tiempo por módulo, tasa de aprobación del quiz).
- Recordar el último curso/módulo abierto al reingresar.

## Cómo probar el MVP (cuando haya red)
1. `npm install` y `npm run dev`.
2. Ir a `/academy/app/`.
3. Login `admin / admin` → Gestión → asignar un curso a "Ana Ríos" (alumno).
4. Cerrar sesión → login `alumno / alumno` → Inicio muestra los cursos asignados.
5. Abrir un curso → los módulos se desbloquean al responder bien la comprobación →
   Finalizar → certificado → verlo en Perfil.
