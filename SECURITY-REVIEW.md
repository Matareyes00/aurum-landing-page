# Vibecoder Security Review — Aurum Landing Page + Academy

**Fecha:** 2026-08-16
**Alcance:** `aurum-landing-page` (landing pública en `src/`) + `Aurum Academy` (SPA cliente en `src/academy/`)
**Stack:** React 18 + Vite (SPA estático, sin backend), desplegado en Vercel. Sin servidor propio: toda la lógica corre en el navegador.

## Resumen

No hay backend, API keys ni base de datos real en este repo — es un sitio estático más un "portal" prototipo que persiste todo en `localStorage` del navegador. Eso reduce mucho la superficie clásica (no hay SQLi, RCE, ni secretos de servidor que robar), pero genera **1 hallazgo crítico** y **2 de severidad media** específicos de esta arquitectura, más un puñado de mejoras de bajo costo. El equipo ya documentó el problema principal en `ACADEMY-PENDIENTES.md`, así que esto formaliza y prioriza lo que falta antes de conectar datos/usuarios reales.

| Severidad | Cantidad |
|---|---|
| 🔴 Crítico | 1 |
| 🟠 Medio | 2 |
| 🟡 Bajo | 3 |
| ✅ Verificado sin hallazgos | secretos, inyección SQL/HTML, RCE, uploads |

---

## 🔴 CRÍTICO: Autenticación y autorización 100% del lado del cliente (bypass trivial)

**Dónde:** [src/academy/app/auth.js](src/academy/app/auth.js), [src/academy/app/data.js](src/academy/app/data.js), [src/academy/app/storage.js](src/academy/app/storage.js), [src/academy/app/PortalApp.jsx](src/academy/app/PortalApp.jsx#L51)

**Problema:** No existe un backend que valide credenciales ni roles. Todo el "login" es:

```js
// auth.js
window.localStorage.setItem(SESSION_KEY, user.id)   // sesión = un id en localStorage

// PortalApp.jsx
const isAdmin = user.role === 'admin'                 // gate de admin sólo en React
```

Cualquier persona con la consola del navegador abierta puede:
1. Ejecutar `localStorage.setItem('aurum-academy-session:v1', 'u_admin')` y recargar → entra como admin **sin contraseña**.
2. Leer el bundle JS (`data.js`/`storage.js`) y ver las credenciales demo en texto plano (`admin/admin`, `alumno/alumno`, `leo/leo`).
3. Editar directamente el objeto `db` en `localStorage['aurum-academy-db:v2']` para cambiarse el rol, las asignaciones de curso o inventar evaluaciones ya "aprobadas" — no hay validación de origen de esos datos, `store.js` incluso escucha el evento `storage` cross-tab y confía en cualquier JSON que llegue con esa clave.

**Impacto:** Hoy el impacto es bajo porque los datos son ficticios (curso demo, clips CC0). Pero es el patrón de riesgo más peligroso para escalar: si en algún momento se conectan usuarios reales, certificados, notas o pagos sobre esta misma base, **cualquiera podría auto-otorgarse rol admin o falsificar su progreso/certificación** sin tocar el servidor, porque no hay servidor que lo impida.

**Ya está reconocido:** `ACADEMY-PENDIENTES.md` dice explícitamente "Autenticación real (seguridad) — LUEGO: backend con auth real... hash de contraseñas". Este hallazgo es para que quede priorizado como bloqueante **antes** de mover cualquier dato real al portal.

**Fix recomendado:**
- No lanzar el portal con datos reales (usuarios, certificaciones, pagos) hasta tener auth server-side (Supabase Auth / Auth.js / Clerk, como ya se planea).
- Hashear contraseñas (bcrypt/argon2) del lado servidor; nunca en el cliente.
- Verificar rol/pertenencia en cada operación sensible en el servidor, no sólo condicionar el render en React.
- Mientras siga siendo 100% cliente: dejarlo explícitamente marcado como demo/sandbox (ya hay `noindex, nofollow` en `academy/app/index.html`, lo cual ayuda) y no acumular datos reales de alumnos ahí.

### Mecanismo de sesión recomendado: token firmado, nunca usuario/password en claro

Hoy la "sesión" es literalmente el `user.id` guardado tal cual en `localStorage` (`aurum-academy-session:v1`), y el login manda `username`/`password` directo desde el formulario a `findByCredentials()` sin ningún cifrado ni hashing de por medio. Cuando exista backend, el flujo debería ser:

1. **En el login:** el cliente manda `username` + `password` una sola vez, por HTTPS, al endpoint de auth. El servidor valida contra el hash almacenado (bcrypt/argon2) — la contraseña **nunca** se guarda ni se reenvía en claro, ni una sola vez más después del login.
2. **El servidor emite un token de sesión firmado** (JWT firmado con HMAC/RS256, o un session id opaco de referencia a una sesión en DB/Redis). Ese token va en el payload, pero:
   - **Nunca debe incluir la contraseña** (ni en claro ni "cifrada" — no hace falta viajar de nuevo).
   - El `username`/email y el `role` pueden ir dentro del payload del JWT, pero **firmados**, no cifrados a secas: la firma es lo que garantiza que el cliente no pueda alterar el rol y reenviarlo (si sólo estuviera "cifrado" sin firma, igual sería indetectable la manipulación si el algoritmo se puede adivinar/depende del cliente). Si además se quiere ocultar el contenido del payload (que ni el propio usuario pueda leer su rol en el token), ahí sí conviene un JWE (JSON Web Encryption) o simplemente un opaque token de sesión sin payload legible, y guardar los claims en el servidor.
3. **El cliente guarda sólo el token** (idealmente en cookie `httpOnly; secure; sameSite=strict`, no en `localStorage`, para que ni siquiera un XSS pueda leerlo con JS). Si se usa `localStorage` por restricciones de la SPA, al menos que el token no contenga secretos y tenga expiración corta + refresh.
4. **Cada request subsiguiente** manda el token; el servidor lo valida (firma + expiración) y de ahí saca `userId`/`role` — nunca confiando en lo que mande el cliente en el body (ver también el hallazgo de "Autenticación & Auth" del checklist OWASP: nunca tomar `role`/`userId` de parámetros del cliente).
5. **Expiración y revocación:** tokens de vida corta (ej. 15–60 min) + refresh token rotativo, y forma de invalidar sesiones (logout real, cambio de contraseña invalida tokens viejos).

En resumen: la contraseña se cifra/hashea **una vez, en el servidor, al crear la cuenta**, y nunca vuelve a viajar. Lo que viaja en cada request es un **token firmado** (no la contraseña "cifrada"), y si se quiere ocultar también el contenido del token, se usa cifrado (JWE) o un token opaco — pero la garantía de integridad (que nadie edite su rol) la da la firma, no el cifrado.

---

## 🟠 MEDIO: Credenciales en texto plano embebidas en el bundle público

**Dónde:** [src/academy/app/storage.js](src/academy/app/storage.js#L147-L149), [src/academy/app/data.js](src/academy/app/data.js#L277-L296)

```js
{ id: 'u_admin', username: 'admin', password: 'admin', role: 'admin', ... }
{ id: 'u_ana', username: 'alumno', password: 'alumno', role: 'student', email: 'ana@tucine.com', ... }
```

Estas contraseñas y emails de "seed" quedan literalmente en el JS que se sirve a cualquier visitante (visibles en el código fuente, sin necesidad de build tools). Hoy son datos ficticios, así que el impacto real es mínimo, pero es un patrón a evitar: si alguien copia este seed como base para datos reales, el hábito de poner contraseñas en claro en un archivo que se bundlea al cliente ya está instalado en el código.

**Fix recomendado:** cuando haya backend, las contraseñas nunca deben viajar al bundle ni almacenarse en claro (hash + salt en servidor). Para el prototipo, al menos dejar un comentario más visible tipo `// NUNCA copiar este patrón a un backend real` (ya hay un comentario similar, se puede reforzar) o generar el seed en runtime desde un archivo no bundleado.

---

## 🟠 MEDIO: Mass assignment / falta de control de autorización a nivel de campo (`updateUser`)

**Dónde:** [src/academy/app/data.js](src/academy/app/data.js#L379-L384), usado desde [ProfileView.jsx](src/academy/app/components/ProfileView.jsx#L29-L32) y [AdminHub.jsx](src/academy/app/components/admin/AdminHub.jsx#L43)

```js
export function updateUser(userId, patch) {
  persist({ ...db, users: db.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)) })
}
```

`updateUser` acepta y aplica **cualquier campo** que se le pase en `patch`, incluido `role`. Hoy funciona porque quien llama con `{ role: ... }` es sólo `AdminHub` (protegido por `isAdmin` en `PortalApp.jsx`) y quien llama desde `ProfileView` sólo manda `{ name, craft, email, bio }`. Pero la función en sí **no valida quién puede cambiar qué campo** — es el patrón clásico de *mass assignment* (OWASP API3:2023 — Broken Object Property Level Authorization). Si en el futuro se agrega cualquier otra pantalla, endpoint o script que llame `updateUser(userId, patch)` con datos que incluyan `role` (por error, por un bug, o por alguien manipulando el `patch` antes de que llegue), un usuario podría auto-asignarse `role: 'admin'` sin pasar por `AdminHub`.

**Fix recomendado:** separar explícitamente `updateProfile(userId, { name, craft, email, bio })` (campos que el propio usuario puede tocar) de `updateUserRole(userId, role)` (sólo invocable desde una capa que ya validó `isAdmin`, e idealmente sólo en el futuro backend). Nunca hacer spread ciego de un `patch` arbitrario sobre un registro con campos sensibles como `role` o `password`.

---

## 🟡 BAJO: Sin límite de intentos de login (brute-force / credential stuffing)

**Dónde:** [src/academy/app/auth.js](src/academy/app/auth.js#L36-L46), [src/academy/app/components/Login.jsx](src/academy/app/components/Login.jsx)

`login()` no tiene rate limiting, lockout ni backoff: se puede llamar en loop desde la consola tantas veces como se quiera para probar contraseñas. Hoy el impacto es bajo porque no hay backend ni límite de red que abusar (todo es local), pero es un hueco que hay que cerrar en el mismo momento en que exista un endpoint real de login.

**Fix recomendado (para cuando haya backend):** rate limiting por IP/usuario (ej. `express-rate-limit`, o el rate limiting nativo de Supabase Auth/Auth.js), backoff progresivo y bloqueo temporal tras N intentos fallidos, y **no revelar** si falló por usuario inexistente vs. contraseña incorrecta (ya se ve bien encaminado: `findByCredentials` devuelve un código genérico `invalid_credentials`, mantener ese criterio en el backend real).

---

## 🟠 MEDIO: `normalizeDb` mezcla datos de `localStorage`/eventos `storage` sin esquema estricto

**Dónde:** [src/academy/app/storage.js](src/academy/app/storage.js) (función `normalizeDb`), [src/academy/app/store.js](src/academy/app/store.js#L58-L68)

```js
export function normalizeDb(candidate) {
  const seed = createSeedDb()
  if (!candidate || typeof candidate !== 'object') return seed
  return { ...seed, ...candidate, version: 2, ... }
}
```

El spread `{ ...seed, ...candidate }` acepta cualquier estructura que venga de `localStorage` (incluyendo la sincronización cross-tab vía el evento `storage`) y la mezcla en el estado vivo de la app sin validar tipos/campos más allá de un par de arrays. No es explotable de forma remota (mismo origen), pero si alguna extensión de navegador maliciosa o un XSS futuro logra escribir en `localStorage`, controla el estado completo de la app (roles, asignaciones, evaluaciones) sin pasar por ninguna validación.

**Fix recomendado:** validar el shape de `candidate` campo por campo (o con un schema ligero tipo `zod`) antes de aceptarlo, en vez de spread ciego.

---

## 🟡 BAJO: `Content-Security-Policy` permite `'unsafe-inline'` en `style-src`

**Dónde:** [vercel.json](vercel.json)

```json
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
```

El resto de la CSP está muy bien configurada (`script-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, HSTS, `X-Frame-Options`, etc. — buen trabajo ahí). `unsafe-inline` en estilos es un riesgo menor (no permite ejecutar JS), pero relaja la defensa en profundidad contra CSS-injection. Como no se detectó contenido de usuario renderizado como HTML/CSS crudo, el riesgo real es bajo.

**Fix recomendado (opcional):** si en el futuro se usan estilos inline dinámicos, evaluar mover a nonces/hashes; si no, dejar como está — no es urgente.

---

## 🟡 BAJO: `robots.txt` no excluye explícitamente `/academy/app/`

**Dónde:** [public/robots.txt](public/robots.txt)

`Allow: /` es global para crawlers de buscadores. El aula (`/academy/app/`) sólo se protege de indexación vía `<meta name="robots" content="noindex, nofollow">` en su `index.html`, lo cual funciona para bots que respetan la etiqueta, pero es una segunda capa más frágil que un `Disallow` explícito.

**Fix recomendado:** agregar `Disallow: /academy/app/` en `robots.txt` como refuerzo (no reemplaza la necesidad de auth real, sólo evita indexación accidental).

---

## 🟡 BAJO: Dependencias — no se pudo ejecutar `npm audit` (sin red en este entorno)

**Dónde:** [package.json](package.json)

Versiones actuales (`react@18.3`, `vite@5.4`, `vitest@2.1`) no muestran señales obvias de abandono o antigüedad extrema. No se detectaron SDKs de nube ni librerías de auth/crypto propias.

**Recomendación:** correr `npm audit` (o `npm audit fix`) periódicamente con acceso a red / en CI, ya que no pudo verificarse en esta revisión por falta de conectividad del entorno.

---

## ✅ Verificado sin hallazgos

- **Secretos/API keys:** no se encontraron claves, tokens ni credenciales de servicios (Stripe/OpenAI/AWS/DB) en el repo. No hay archivos `.env*`.
- **Inyección HTML/XSS:** no hay uso de `dangerouslySetInnerHTML`, `innerHTML` ni `document.write` en `src/`. Los íconos son SVG como JSX (no strings inyectados).
- **Inyección de código / RCE:** no se encontró `eval`, `new Function`, `exec`/`subprocess` con input de usuario, ni deserialización insegura.
- **SQL/NoSQL injection:** no aplica — no hay base de datos ni queries; todo vive en `localStorage`.
- **Subida de archivos:** no hay funcionalidad de upload en el código revisado.
- **CORS/headers:** headers de seguridad configurados correctamente en `vercel.json` (HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, CSP con `script-src 'self'`).
- **Recursos externos:** los clips de video de ejemplo (`mdn.github.io/shared-assets`) son CC0 y sirven con `Access-Control-Allow-Origin: *`, consistente con el comentario en el código sobre por qué se eligió ese host.

---

## Checklist OWASP Top 10 (2021) — cobertura de esta revisión

| # | Categoría | Estado en este repo |
|---|---|---|
| A01 | Broken Access Control | 🔴 Ver hallazgo crítico (gate de admin sólo en cliente) + 🟠 mass assignment en `updateUser` |
| A02 | Cryptographic Failures | 🟠 Contraseñas en claro en el bundle; falta el mecanismo de token firmado descripto arriba |
| A03 | Injection (SQL/NoSQL/XSS/Command) | ✅ Sin hallazgos — no hay queries ni `innerHTML`/`eval` con input de usuario |
| A04 | Insecure Design | 🟠 El diseño actual (auth y autorización sólo en el cliente) es aceptable sólo mientras sea prototipo con datos falsos; no escala a producción sin rediseno |
| A05 | Security Misconfiguration | 🟡 Buena base (CSP, HSTS, `X-Frame-Options`), con nota menor en `style-src 'unsafe-inline'` |
| A06 | Vulnerable and Outdated Components | ⚪ No verificable en este entorno (sin red para `npm audit`); versiones actuales no lucen desactualizadas |
| A07 | Identification and Authentication Failures | 🔴 Mismo hallazgo crítico (sesión = id en `localStorage`, sin hashing, sin rate limiting) |
| A08 | Software and Data Integrity Failures | ✅ Sin CI/CD con pasos no verificados detectados; sin deserialización insegura. Nota: sincronización cross-tab vía evento `storage` confía en el JSON sin validar (cubierto en el hallazgo de `normalizeDb`) |
| A09 | Security Logging and Monitoring Failures | ⚪ No aplica todavía (no hay backend que loguee); a tener en cuenta cuando exista uno — registrar intentos de login fallidos, cambios de rol, etc. |
| A10 | Server-Side Request Forgery (SSRF) | ✅ No aplica — no hay backend que haga requests server-side a URLs controladas por el usuario |

**Leyenda:** 🔴 crítico/alto · 🟠 medio · 🟡 bajo · ✅ verificado sin hallazgos · ⚪ no aplica / no verificable en este entorno.

---

## Quick Wins (orden sugerido)

1. **No conectar datos reales de alumnos/pagos/certificados** al portal actual hasta implementar auth real server-side (ya priorizado en `ACADEMY-PENDIENTES.md`).
2. Separar `updateUser` en `updateProfile` (self-service) y `updateUserRole` (sólo admin/backend) para eliminar el mass assignment sobre `role`.
3. Agregar `Disallow: /academy/app/` en `robots.txt`.
4. Validar el shape de `candidate` en `normalizeDb` en vez de spread ciego.
5. Cuando se implemente el backend: hash de contraseñas (bcrypt/argon2) en el servidor, token de sesión firmado (JWT/cookie httpOnly+secure+sameSite) que **nunca** transporte la contraseña, rate limiting/lockout en el login, y checks de rol leídos del token/servidor en cada endpoint (nunca confiar en `role`/`userId` que mande el cliente).
6. Ejecutar `npm audit` con conectividad de red / en el pipeline de CI.
7. Cuando exista backend, agregar logging/monitoreo de eventos de seguridad (intentos de login fallidos, cambios de rol, exportaciones de datos) — hoy no aplica porque no hay servidor.

## Contexto

- **Stack:** React 18 + Vite, sin backend propio, desplegado en Vercel.
- **Entorno visible:** sólo build estático; no se detectó `staging` ni credenciales de producción.
- **Patrón de auth:** ninguno real todavía — sesión basada en `localStorage` (prototipo, ya documentado como pendiente por el equipo).
