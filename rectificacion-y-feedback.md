# Rectificación y feedback — Landing Aurum (segunda iteración)

Primero lo más importante: lo que hiciste está muy bien. El alma de la landing,
el enamoramiento al cineasta, la ejecución cinematográfica (el guión, las
escenas, los créditos, el casting), el frontend — todo eso funciona y NO hay
que tocarlo. Este documento no viene a corregir el rumbo: viene a completar
algo que falta.

Leé todo antes de arrancar. Hay contexto nuevo que necesitás entender para
poder transmitirlo bien, y hay una regla que no se negocia.

---

## LA REGLA QUE NO SE NEGOCIA

No mates el alma. No apagues la poesía con lenguaje corporativo frío. Lo que
hoy enamora al cineasta es el imán de Aurum y es sagrado.

Y su corolario: **el frontend tiene que seguir siendo increíble.** Todo lo que
agregues o cambies tiene que estar a la altura cinematográfica de lo que ya
hiciste. Si por reestructurar tenés que sacar algo brillante (como la
metáfora del guión), NO lo elimines a secas: reemplazalo por algo igual de
bello y con el mismo criterio cinematográfico. Nunca bajes el nivel visual
para ganar claridad. Las dos cosas a la vez: más claro Y tan hermoso como
ahora.

Tenés libertad creativa total en el cómo. Te decimos qué queremos lograr, no
cómo hacerlo. No te damos código ni estructura obligada. Sorprendenos.

---

## EL PROBLEMA A RESOLVER

La landing tiene mucha alma y poca claridad sobre el trabajo real. Un cineasta
entra y se enamora, pero sale sin entender bien QUÉ va a hacer concretamente
ni EN QUÉ consiste el trabajo.

Hoy la balanza está en ~80% emoción / 20% sistema. Queremos llevarla a algo
como 65% emoción / 35% sistema —sin perder nada del corazón—, agregando una
columna vertebral que aparezca en el medio del recorrido. El cineasta tiene
que salir sintiendo dos cosas a la vez: "Aurum me entiende" (ya lo lográs) Y
"entiendo qué voy a hacer y por qué mi ojo vale" (esto falta).

---

## CONTEXTO QUE NECESITÁS ENTENDER (conceptos de Aurum)

Vas a usar algunos términos propios de Aurum. Para transmitirlos bien,
entendé qué son. No tenés que explicarlos técnicamente en la landing —tenés
que hacer que un cineasta los sienta cercanos y deseables.

### Qué hace Aurum, en concreto

La IA genera video, pero no sabe juzgar si está bien. Los laboratorios de IA
más grandes del mundo necesitan que expertos humanos evalúen ese video para
entrenar sus modelos. Ese trabajo se llama, técnicamente, "evaluación de video
generativo" o "anotación de datos especializada". Aurum lo hace con
cineastas de verdad, con estándares de rodaje.

El trabajo concreto de un evaluador Aurum es, por ejemplo: mirar un clip
generado por IA y detectar dónde falla (la cara del personaje cambia, la luz
no tiene fuente, se rompe la continuidad); o comparar dos clips y decir cuál
es mejor y por qué; marcar el momento exacto del problema; y justificar la
decisión con criterio de oficio. Eso, hecho miles de veces con rigor, es lo
que entrena a los modelos.

### El Aurum Codex

Es el "idioma común" de Aurum. Un cineasta tiene el ojo, pero cada uno nombra
las cosas a su manera. El Codex es el vocabulario compartido que convierte
"esto se siente mal" en algo preciso, consistente y comparable: nombres de
errores, niveles de severidad, grados de confianza, razones. Es lo que hace
que la evaluación de un cineasta se transforme en un DATO que la máquina puede
aprender.

La idea clave a transmitir: **tener ojo abre la puerta; aprender el Codex es lo
que convierte ese ojo en criterio útil para la IA.** El Codex no es
burocracia: es lo que hace valioso y profesional el trabajo. Es la traducción
mágica de "lenguaje de cine → dato para IA". La varita está en el set, no en
Silicon Valley.

### Los Workflows

Aurum tiene distintos tipos de tarea de evaluación (los "workflows"). El
primero, el que arranca, es "Preference Evaluation": comparar dos videos
generados por IA y decidir cuál cumple mejor, explicando por qué con criterios
claros. Es el más simple de entender y el primero de la certificación.

### La doble pata (el diferencial de Aurum — importante)

Esto es lo que hace único a Aurum y hoy casi no se entiende en la landing. El
valor no es solo "tener ojo de cine". Es la COMBINACIÓN de dos cosas:
1. El criterio cinematográfico (el ojo, el oficio)
2. El rigor de la anotación entrenada (saber traducir ese ojo a dato preciso)

Los laboratorios no consiguen esa combinación en ningún otro lado: los
proveedores grandes tienen anotadores sin ojo de cine, o cineastas sin
entrenamiento en anotación. Aurum junta las dos, entrenadas. Un cineasta tiene
que entender: "no me contratan solo por tener ojo; me entrenan para convertir
ese ojo en algo riguroso y valioso, y esa combinación es lo que me hace único".

---

## QUÉ QUEREMOS SUMAR (el qué, no el cómo)

### 1. Explicar mejor "el trabajo" — hacerlo concreto

La escena del visor de evaluación (el EVAL con el clip y los errores marcados)
es de lo mejor de la landing. Pero hay que hacerla más literal, que se entienda
"esto es lo que vas a hacer, concretamente".

Dos cosas que ayudarían:

- **Mostrar la traducción de cine a dato.** Cuando se marca un error, que se
  vea el lenguaje de cine Y su traducción al Codex, en capas. Por ejemplo, la
  idea (no el diseño): primero el lenguaje humano de oficio ("Salto de eje: la
  mirada cruza la línea"), y debajo o al lado, la traducción Aurum ("Spatial
  Continuity Error · Severidad alta · Confianza alta"). Eso muestra el puente
  mágico: ojo de cine → lenguaje Aurum → dato para IA. No lo hagas frío ni
  demasiado técnico en el primer impacto: primero emociona el lenguaje de cine,
  después aparece el rigor como una capa que suma.

- **Mostrar un ejemplo simple del trabajo real**, idealmente del Workflow 1
  (comparar dos videos). Que un cineasta vea "ah, es esto: miro, comparo,
  elijo cuál es mejor, marco por qué con criterio". Algo como: Video A vs Video
  B → gana B → razón: mejor consistencia temporal → comentario: la cara de A se
  rompe en el movimiento de cámara. Que se entienda que no es "opinar", es
  mirar con oficio y traducirlo a una evaluación clara.

### 2. Una sección nueva: "El entrenamiento"

Esta es la pieza que más falta. Iría en el medio del recorrido (después de "El
trabajo", antes o cerca de "El recorrido"). Su mensaje central:

**Tener ojo abre la puerta. Entrenarlo con Aurum es lo que lo convierte en
criterio útil para los modelos de IA.**

Podría girar en torno a tres ideas (vos decidís cómo expresarlas):
- Aprendés el Codex — el idioma común de Aurum para nombrar errores, comparar
  videos y justificar decisiones.
- Practicás con casos reales — evaluás clips generados por IA, comparás
  outputs, recibís feedback.
- Te certificás — cuando tu criterio es consistente, entrás a la pool de Aurum.

Esto introduce el Codex, el entrenamiento y la certificación sin romper el
tono. Hacelo cinematográfico, no un temario de curso.

### 3. Aterrizar los pasos del recorrido

En la sección del recorrido (Aplicás / Calibrás / Evaluás), el paso "Calibrás"
hoy es vago ("te entrenamos en nuestros estándares"). Que se entienda qué es
ese entrenamiento concreto: aprender el Codex, practicar con casos reales,
certificarte. Sin perder la metáfora linda del "calibrar un monitor antes de
etalonar", que está muy bien.

### 4. Ajustar apenas el casting (el filtro)

El casting hoy dice "pedimos oficio, hambre y amor por la imagen". Está bien el
espíritu de puerta abierta —NO lo cierres, no pongas barreras frías, no
excluyas al talento sin diploma— pero conviene un piso de oficio para no
llenarse de ruido. La idea: buscamos ojo formado en la práctica real (set,
edición, color, sonido, dirección, o estudio serio del lenguaje audiovisual),
no diplomas perfectos. Y el reel/portfolio/muestra de trabajo: mejor
"recomendado para avanzar" que opcional a secas, sin volverlo un muro
obligatorio que excluya a alguien talentoso sin reel armado.

---

## PÁGINA APARTE: AURUM ACADEMY

Esta es una PÁGINA SEPARADA (mismo dominio, no dentro de la landing principal).
En la landing principal va un bloque/llamado que invita a ella, pero la Academy
tiene su propia página.

### Qué es

Aurum Academy es donde un cineasta se entrena y se certifica. La idea de
negocio: ofrecemos una certificación gratuita en la que un cineasta aprende a
evaluar video generado por IA con criterio de cine. Al certificarse, recibe un
certificado que puede exhibir (por ejemplo en LinkedIn) y entra a la pool de
talento de Aurum, desde donde salen proyectos pagos en dólares.

La primera certificación es el Workflow 1 (Preference Evaluation), que Juan
—el equipo— va a subir pronto. Por ahora va como **PRÓXIMAMENTE**, con una
forma de anotarse / dejar el contacto / recibir aviso cuando abra.

### El nombre / titular (elegir uno — pensado para seducir al cineasta)

El público son cineastas que NO conocen el mundo del "data annotation". El
nombre técnico ("Experto Anotador en Video Generativo") les suena frío y
ajeno. El titular tiene que hablarle a su ojo, su criterio, su oficio — algo
que les dé orgullo y ganas. Opciones para elegir (o inspirar la tuya):

- "Entrená tu ojo para la era del video generativo."
- "Convertí tu ojo de cine en un oficio nuevo."
- "Certificate como Evaluador Cinematográfico de Video IA."
- "El nuevo oficio de mirar. Certificado por Aurum."
- "Tu ojo, certificado. Un oficio nuevo para tu criterio de cine."

(La keyword técnica —"evaluación de video generativo / anotación
especializada"— puede vivir en la descripción, para que tenga valor real de
CV/LinkedIn, mientras el titular seduce con el lenguaje del oficio.)

### Qué muestra la página de la Academy

- El titular seductor.
- Qué vas a aprender: a evaluar/comparar video de IA con criterio de cine, el
  Codex de Aurum, y estándares de anotación profesional.
- Que es gratuita, y que al certificarte entrás a la pool y accedés a proyectos
  pagos en dólares.
- Workflow 1: Preference Evaluation — PRÓXIMAMENTE.
- Un CTA para dejar el contacto / anotarse a la primera cohorte / recibir aviso.
- Mismo mundo visual y cinematográfico que la landing. Tiene que sentirse parte
  de Aurum, hermosa, a la altura.

---

## SOBRE LO QUE YA HICISTE BIEN (no lo pierdas)

- El hero quedó bien, no lo toques por ahora.
- La escena del cineasta (el guión INT. PIEZA DE EDICIÓN 3:47 AM) es brillante
  y única. Si por reestructurar necesitás moverla o cambiarla, reemplazala por
  algo con el MISMO encanto cinematográfico. No la degrades.
- La estética de guión, timecode, escenas numeradas, créditos rodantes,
  casting: todo ese lenguaje de cine es el sello de Aurum. Mantenelo o superalo.
- La comunidad como "casa de cine", el tono de par, el footer "hecho por gente
  que ama la imagen": intactos.

Un detalle menor a corregir: la numeración de las escenas está desfasada (los
títulos dicen "ESC. 04" pero el número interno dice "ESC. 03", etc.). Alinealos,
porque en una landing que hace del lenguaje de guión su recurso, que los
números no cierren es justo lo que un cineasta nota.

---

## LA VARA FINAL

Un cineasta entra. Al salir tiene que sentir, a la vez:
1. "Aurum me entiende" (el alma — ya lo lográs)
2. "Entiendo qué voy a hacer, cómo me entrenan, y por qué mi ojo se vuelve
   valioso" (la claridad — esto es lo que falta)
3. "Esto es lo más hermoso que vi" (el frontend — mantenelo o superalo)

Si logra las tres, ganaste. No sacrifiques ninguna por las otras.