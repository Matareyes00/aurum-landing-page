# AURUM — Estructura de Contenido (v2)

Documento completo del texto del sitio, organizado por sección en orden de aparición.
Cubre las dos páginas: la **landing principal** (`/`) y **Aurum Academy** (`/academy/`).

> Nota de numeración: los encabezados de este documento coinciden 1:1 con los rótulos
> visibles en la página (`ESC. XX`) y con el contador del HUD (`ESC XX / 07`).
> El Marquee es una transición sin número de escena.

---

# PÁGINA PRINCIPAL — LANDING

## ESC. 00 — HERO (Portada)

### Visual
- Wordmark AURUM auténtico (imagen del logo original) + símbolo
- Atmósfera: key light, breathing beam, dust particles, sheen sobre letras

### Copy

**Descriptor:**
> Criterio de cine para la era del video generativo

**Tesis:**
> La máquina ya aprendió a generar.
> Todavía no aprendió a *mirar*.

**Subtítulo:**
> Fotografía, montaje, color y sonido evaluando video generativo con rigor de oficio. **Pagado en dólares**, para financiar lo que de verdad querés filmar.

### CTAs
1. **Gold:** "Quiero ser parte" → #aplicar
2. **Ghost:** "Ver cómo funciona" → #escena-01

### UI
- Scroll cue: "Rodando" + línea animada

---

## ESC. 01 — La escena que conocés (Tension)

### Screenplay

```
INT. PIEZA DE EDICIÓN — 3:47 AM

Sobre la mesa: un guión en su quinta reescritura, un presupuesto que no
cierra y una cámara que vive en la pestaña de favoritos desde hace meses.

                    CINEASTA
              (bajando el brillo del monitor)

        ¿Cómo pago mi película sin dejar de ser cineasta?
```

### Copy

**Headline:**
> Esa escena la *filmamos* todos.

**Body 1:**
> Para sostener tu cine casi siempre hay que hacer otra cosa: la publicidad ajena, el evento del fin de semana, el trabajo que paga pero te aleja del set. No es falta de talento ni de oficio: es la economía del cine independiente.

**Body 2:**
> Aurum existe para cortar ese plano. Un trabajo que se hace **con lo mismo que te hace cineasta** —tu ojo, tu criterio, tus horas de sala y de rodaje— y que paga en dólares el cine que querés hacer.

### Pullquote
> Que el oficio
> pague *la obra*.

---

## MARQUEE (transición, sin número)

Loop infinito de términos de cine:
ENCUADRE · RACCORD · CLAROSCURO · ETALONAJE · TRAVELLING · CONTINUIDAD · FOLEY · MONTAJE · LUZ MOTIVADA · PROFUNDIDAD DE CAMPO

---

## ESC. 02 — El trabajo (Mechanism)

### Lead

**Headline:**
> La IA ya genera video. Todavía no sabe si *está bien*.

**Body:**
> Un modelo puede producir mil planos por hora. No puede decirte si la cara del personaje cambió entre tomas, si la luz rompe la continuidad, si la escena respira o se cae. Eso lo da el oficio: años de set, de isla de edición y de sala oscura. **Vos lo traés puesto.**

### Visor EVAL (scrub en desktop / log en mobile)

**OSD:** `EVAL · CLIP_047 · GEN-V4 · [timecode]`

**Anotaciones en dos capas — lenguaje de cine + traducción Codex:**

1. ⚠ 00:02:11 — LA CARA DEL PERSONAJE NO ES LA DEL PLANO ANTERIOR
   ⤷ CODEX · IDENTITY DRIFT · SEV. CRÍTICA · CONF. 0.96
2. ⚠ 00:05:03 — TEMPERATURA DE COLOR SALTA DE 5600K A 3200K
   ⤷ CODEX · COLOR CONTINUITY BREAK · SEV. MEDIA · CONF. 0.98
3. ⚠ 00:07:19 — SALTO DE EJE: LA MIRADA CRUZA LA LÍNEA
   ⤷ CODEX · SPATIAL CONTINUITY ERROR · SEV. ALTA · CONF. 0.91
4. ⚠ 00:09:12 — LA SOMBRA NO RESPONDE A NINGUNA FUENTE
   ⤷ CODEX · LIGHT SOURCE MISMATCH · SEV. ALTA · CONF. 0.87

*(En desktop, la línea de cine aparece primero y la traducción Codex la sigue medio beat después — primero emociona el oficio, después aparece el rigor.)*

**Veredicto:** RECHAZADO

**Caption:**
> La máquina no lo vio. **Vos, en dos segundos.**
> OJO DE CINE → CODEX → DATO

### Post-visor

**Body 1:**
> Los laboratorios de IA más grandes del mundo necesitan ese veredicto para entrenar sus modelos. Se llama **evaluación experta de video generativo**: un oficio real y demandado —anotación de datos especializada— que nosotros hacemos con estándares de rodaje.

**Body 2:**
> Lo que ves con oficio se escribe en el **Codex** —el idioma de Aurum— y se convierte en un dato que la máquina puede aprender. No es una encuesta ni una microtarea: es tu criterio profesional aplicado plano por plano, con rúbricas claras y **pago en dólares**.

### Workflow 01 — Demo del trabajo real (duelo de tomas)

**Label:** WORKFLOW 01 · PREFERENCE EVALUATION · TU PRIMERA TAREA

**Headline:**
> Dos tomas entran. *Una sale.*

**Body:**
> Así de concreto: dos versiones del mismo plano, generadas por IA. Las mirás, elegís cuál sostiene la escena y firmás por qué. No es opinar — es mirar con oficio y traducirlo a una decisión con criterio, severidad y motivo.

**Duelo visual:**
- TOMA A · CLIP_089 — la "cara" se rompe durante el paneo (ghost animado)
  - ⚠ LA CARA NO SOBREVIVE EL PANEO
  - ⤷ CODEX · TEMPORAL INCONSISTENCY · SEV. ALTA · CONF. 0.93
- **VS**
- TOMA B · CLIP_089 — sostiene el plano → sello dorado **ELEGIDA**

**Hoja de evaluación (slip):**
```
HOJA DE EVALUACIÓN · WF-01 · CLIP_089 A/B
GANA TOMA B — CRITERIO: CONSISTENCIA TEMPORAL
NOTA: LA CARA DE A PIERDE IDENTIDAD DURANTE EL MOVIMIENTO DE CÁMARA.
      B SOSTIENE PERSONAJE, LUZ Y PLANO.
EVALUADOR/A: Vos        ← firma en serif itálica dorada
```

### Role Cards

| CAM | Título | Descripción |
|-----|--------|-------------|
| CAM A | Fotografía | Luz sin fuente, ópticas que mienten, continuidad lumínica que se rompe entre planos. |
| CAM B | Montaje | Ritmo, raccord, ejes. El corte que se siente mal antes de poder explicarse. |
| CAM C | Color | Pieles imposibles, paletas que se quiebran, grados que delatan a la máquina. |
| CAM D | Sonido | Salas que no existen, mezclas sin espacio, foley fantasma fuera de cuadro. |

---

## ESC. 03 — El entrenamiento (Training) — NUEVA

### Headline

> Tener ojo abre la puerta.
> El Codex lo vuelve *criterio*.

### Lede (la doble pata)

> Tu ojo ya sabe ver. Aurum le suma el idioma: el **Codex**, el vocabulario común que convierte «esto se siente mal» en algo preciso, consistente y comparable. Criterio de cine + rigor de anotación: **la combinación que los laboratorios de IA no consiguen en ningún otro lado**, junta y entrenada.

### El Prisma (traducción en vivo, rota cada ~4.6s)

Estructura: TU OJO DICE → [símbolo Aurum en rombo de vidrio] EL CODEX TRADUCE → LA MÁQUINA APRENDE

| Tu ojo dice | El Codex traduce | La máquina aprende |
|---|---|---|
| «La sombra no responde a ninguna fuente.» | LIGHT SOURCE MISMATCH · SEV. ALTA · CONF. 0.87 | DATO DE ENTRENAMIENTO N.º 48.291 |
| «La mirada cruza la línea: se rompió el eje.» | SPATIAL CONTINUITY ERROR · SEV. ALTA · CONF. 0.91 | DATO DE ENTRENAMIENTO N.º 48.292 |
| «Esa piel no existe en ningún mundo con sol.» | SKIN TONE ARTIFACT · SEV. MEDIA · CONF. 0.94 | DATO DE ENTRENAMIENTO N.º 48.293 |

### Las tres bobinas

**BOBINA 01 — El idioma**
> Aprendés el Codex: los nombres de los errores, los niveles de severidad, los grados de confianza. Lo que siempre supiste ver, ahora se puede decir — y medir.

**BOBINA 02 — La práctica**
> Evaluás clips reales generados por IA: comparás versiones, marcás la falla en el frame exacto, justificás cada decisión. Con feedback de evaluadores que ya recorrieron el camino.

**BOBINA 03 — La firma**
> Cuando tu criterio se vuelve consistente, te certificás y entrás a la pool de Aurum. De ahí salen los proyectos pagos, en dólares.

### CTA Academy (tarjeta de estreno con reflectores)

**Label:** PRÓXIMAMENTE · EN ESTA SALA
**Título:** [wordmark AURUM] + ACADEMY
**Copy:**
> La certificación **gratuita** que convierte tu ojo de cine en un oficio nuevo. Primera cohorte: Workflow 01 — Preference Evaluation.

**Botón (gold):** "Reservá tu butaca" → /academy/

---

## ESC. 04 — El recorrido — travelling (Process)

### TOMA 1 — 01 — Aplicás
> Contanos quién sos: tu rol, tu recorrido, tu reel si tenés. Buscamos ojo y oficio, no diplomas. Te responde una persona, no un formulario.

### TOMA 2 — 02 — Calibrás *(actualizada)*
> Aprendés el Codex —el idioma de Aurum para nombrar errores y justificar decisiones—, practicás con casos reales y te certificás. Tu criterio ya existe; acá se afina como se calibra un monitor antes de etalonar.

### TOMA 3 — 03 — Evaluás
> Trabajás remoto, en tus horarios, con proyectos reales de laboratorios de IA. Cobrás en dólares. Y cada hora te acerca un poco más a tu próximo rodaje.

---

## ESC. 05 — La comunidad (Community)

### Headline
> No es una plataforma.
> Es una *casa de cine*.

### Intro
> Nadie evalúa solo. Detrás de cada plano hay foros que arden con la película del momento, mesas de crítica, y referentes de la industria que sirven de faro para quienes recién empiezan.

### Pilares

**FARO — Referentes cerca**
> Directores de foto, editores y coloristas de trayectoria que ya recorrieron el camino que estás empezando — y responden, sin escenario de por medio.

**FORO — Conversación de oficio**
> Del etalonaje de esa serie al lente de aquel plano. La película del momento, discutida por gente que la mira cuadro a cuadro.

**MESA — Crítica entre pares**
> El criterio se entrena mirando y se agudiza discutiendo. Mesas de crítica donde tu lectura de un plano crece con la de los demás.

---

## ESC. 06 — La promesa (Promise / créditos rodantes)

### Headline
> Nuestra escena soñada
> no sale acá. Sale en *tus créditos*.

### Créditos

**TU PRÓXIMA PELÍCULA — FICHA TÉCNICA**

| Rol | Nombre |
|-----|--------|
| Guión | Vos |
| Dirección | Vos |
| Fotografía | Vos y los tuyos |
| Montaje | Vos |
| Color | Vos |
| Sonido | Vos |
| **Financiación** | **Tu ojo** *(dorado)* |

### Cierre
> Cada hora que evaluás acá es una luz que alquilás, un día de rodaje que asegurás, una escena que filmás. Que cuando cuentes cómo la hiciste, **Aurum sea parte de la respuesta**.

---

## ESC. 07 — Escena final — casting (Apply)

**Label:** Convocatoria abierta

### Headline
> El casting está *abierto*.

### Body *(actualizado — piso de oficio sin cerrar la puerta)*
> Contanos quién sos y qué mirás. Buscamos **ojo formado en la práctica real** —set, isla de edición, sala de color, sonido, dirección o estudio serio del lenguaje audiovisual—. Sin diplomas perfectos: oficio, hambre y amor por la imagen. Te responde una persona del equipo.

### Contacto directo
> También podés escribirnos directo: hello@aurumvisual.com
> ¿Querés entrenar tu ojo primero? Conocé Aurum Academy → /academy/

### Formulario

1. **Nombre** — requerido — "Tu nombre"
2. **Tu oficio** — requerido — select: Dirección de fotografía / Montaje · Edición / Color · Etalonaje / Sonido · Mezcla / Dirección / Estudiante de cine / Otro oficio de la imagen
3. **Email** — requerido — "vos@tucine.com"
4. **Reel o muestra de trabajo (recomendado)** — opcional — "https://"
   - Hint: *"Una muestra de tu mirada hace avanzar tu aplicación mucho más rápido. Si no tenés reel armado, mandá lo que tengas."*
5. **¿Qué te trajo hasta acá? (opcional)** — textarea — "El corto que querés filmar, la cámara que querés comprar, la historia que te debés…"

**Botón:** "Aplicar a Aurum" (mailto hello@aurumvisual.com)
**Nota:** SE ABRE TU CLIENTE DE CORREO · SIN SPAM, PALABRA DE CINÉFILOS

---

## FOOTER

- Lockup Aurum Visual
- Tagline: *Hecho por gente que ama la imagen.*
- Meta: © 2026 Aurum Visual · hello@aurumvisual.com · **Aurum Academy** (link) · 24 FPS · 2.39:1 · Grano en cámara

## NAV (global)

- Brand: símbolo + wordmark (aparece al scrollear)
- Links: El trabajo → #trabajo · Entrenamiento → #entrenamiento · Comunidad → #comunidad · Academy → /academy/ · **Aplicar** (CTA) → #aplicar

## HUD

- Timecode de scroll · 2.39:1 · 24 FPS · **ESC XX / 07** · toggle SALA (room tone)

---
---

# PÁGINA APARTE — AURUM ACADEMY (`/academy/`)

Mismo mundo visual que la landing: grano, viñeta, cursor de encuadre, Lenis,
gates de apertura, reflectores de estreno (searchlights) y polvo en el hero.

## HERO

**Chip:** PRÓXIMAMENTE · PRIMERA COHORTE · CERTIFICACIÓN GRATUITA

**Título:** [wordmark AURUM] + ACADEMY

**Headline:**
> El nuevo oficio
> de *mirar*.

**Sub:**
> Convertí tu ojo de cine en un oficio nuevo. Una certificación gratuita donde aprendés a evaluar video generado por IA con criterio de oficio y estándares de anotación profesional. Al certificarte, entrás a la pool de Aurum: **proyectos reales, pagos en dólares**.

**Keyline (SEO/CV):**
> CERTIFICACIÓN · EVALUACIÓN EXPERTA DE VIDEO GENERATIVO · ANOTACIÓN ESPECIALIZADA

**CTAs:** "Reservá tu butaca" (gold → #anotarse) · "Qué vas a aprender" (ghost → #programa)

**Nav Academy:** brand → `/` · "Volver a la sala" → `/` · CTA "Reservar butaca" → #anotarse

---

## AC. 01 — El programa

### Headline
> Tres bobinas. Un oficio *nuevo*.

### Lede
> No venimos a enseñarte a mirar: eso ya lo traés. Venimos a darte el idioma y el estándar para que tu mirada se vuelva **criterio útil para entrenar modelos** — y un trabajo que se paga.

### Bobinas

**BOBINA 01 — El Codex**
> El idioma de Aurum: la taxonomía de errores del video generativo —identidad, luz, continuidad, física, sonido—, los niveles de severidad y los grados de confianza. Nombrar lo que ves como lo nombra la industria que entrena modelos.

**BOBINA 02 — Los workflows**
> Preference Evaluation: comparar dos outputs y decidir con criterio, no con instinto suelto. Detección de fallas: marcar el frame exacto y justificar. Casos reales, feedback real, estándares de anotación profesional.

**BOBINA 03 — El certificado**
> Un certificado verificable de Evaluador Cinematográfico de Video Generativo —para tu LinkedIn y tu CV— y la entrada a la pool de talento de Aurum, de donde salen los proyectos pagos en dólares.

---

## AC. 02 — Cómo funciona (filmstrip con perforaciones)

| Frame | Título | Copy |
|-------|--------|------|
| F·01 | Te anotás | Dejás tu contacto. Te avisamos cuando abra la primera cohorte. |
| F·02 | Cursás gratis | El Codex, los workflows y práctica con clips reales. Sin costo. |
| F·03 | Te certificás | Demostrás criterio consistente y firmás tu certificado. |
| F·04 | Entrás a la pool | Proyectos de laboratorios de IA, pagos en dólares. |

**Nota:** GRATUITA DE PUNTA A PUNTA · TU OJO PONE EL RESTO

---

## AC. 03 — Primera certificación (ticket)

**Label:** CERTIFICACIÓN 01 · WORKFLOW 01

### Headline
> Preference Evaluation

### Body
> Dos videos generados por IA, lado a lado. Decidís cuál cumple mejor y explicás por qué, con criterios claros del Codex. Es la primera certificación de Aurum — y tu entrada a la pool.

**Visual:** mini frames A **vs** B (B destacada en dorado)
**Sello (rotado, dorado):** PRÓXIMAMENTE
**Nota:** EL EQUIPO ESTÁ CARGANDO EL PROYECTOR

---

## AC. 04 — Función privada (reserva)

**Label:** Cupos de la primera cohorte

### Headline
> Reservá tu *butaca*.

### Body
> La primera cohorte abre pronto y arranca con cupos cortos. Dejanos tu contacto y te guardamos el asiento: te escribimos una sola vez, cuando se abra la sala.

**Cross-link:**
> ¿Ya te sentís listo/a para aplicar directo? El casting está abierto → /#aplicar

### Formulario
1. **Nombre** — requerido
2. **Email** — requerido
3. **Tu oficio (opcional)** — "Foto, montaje, color, sonido, dirección…"

**Botón:** "Reservar mi butaca" (mailto hello@aurumvisual.com, asunto "Aurum Academy — Reserva primera cohorte")
**Nota:** SE ABRE TU CLIENTE DE CORREO · UN SOLO AVISO, PALABRA DE CINÉFILOS

**Footer:** compartido con la landing.

---

# BALANCE Y TONO (v2)

**Balance emoción/sistema:** ~65% / 35%. La columna vertebral nueva (Codex, Workflow 01, entrenamiento, certificación, Academy) vive en ESC. 02–04 sin tocar el corazón (hero, guión, comunidad, promesa, casting).

**Conceptos clave introducidos:**
- **El Codex** — el idioma común: ojo de cine → lenguaje Aurum → dato para IA. "La varita está en el set, no en Silicon Valley."
- **Workflow 01 / Preference Evaluation** — la primera tarea concreta: comparar, elegir, firmar por qué.
- **La doble pata** — criterio de cine + rigor de anotación: lo que los laboratorios no consiguen en otro lado.
- **La certificación** — gratuita, exhibible (LinkedIn), puerta a la pool de proyectos pagos.

**Lo que NO se toca:** el hero, el guión INT. PIEZA DE EDICIÓN, la casa de cine, los créditos, el tono de par, el footer.
