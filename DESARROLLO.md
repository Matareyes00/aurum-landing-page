# Aurum — Landing · Guía de desarrollo

Landing de una sola página construida con **Vite + React**, animada con
**GSAP (ScrollTrigger)** y **Lenis** (smooth scroll).

## Correr en localhost

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build de producción

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

## Deploy en Vercel

El proyecto es un sitio Vite estándar; Vercel lo detecta solo.

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

O por CLI: `vercel --prod` desde la raíz del proyecto.

## Estructura

```
public/            logos optimizados (favicon, símbolo, lockup, OG)
logos_aurum/       material de marca original (no se sirve)
src/
  App.jsx          orquestación: Lenis, ScrollTrigger, luz de cursor, escenas
  components/      Ident (placa de apertura), Hero, Tension, Mechanism,
                   Process, Community, Promise, Apply, Footer, Nav, Hud
  styles/          global.css — sistema visual completo (oro/negro, grano,
                   viñeta, tipografías, responsive)
```

## Efectos

- **Apertura**: countdown de cabecera de bobina `3 → 2 → 1` + placa de
  productora + cortinas. Se reproduce en cada carga directa; click la saltea.
- **Scrub de edición** (ESC. 02, desktop): el viewer se pinnea y el scroll
  scrubea el clip — timecode, cortes de plano, anotaciones por TC, sello.
  En mobile: anotaciones como log bajo el monitor.
- **Letterbox dinámico**: barras 2.39:1 entran mientras el viewer está
  pinneado (solo ≥900px). Se dispara vía evento `aurum:letterbox`.
- **Cursor de encuadre** (desktop): corner brackets que siguen el mouse y
  se cierran sobre los elementos clicables.
- **Hero de marca**: AURUM como título de póster (Cinzel, oro), símbolo
  plano arriba, tesis como bajada. Atmósfera de sala en CSS: key light
  cálida, haz diagonal que respira, pool de luz en el piso, polvo en
  canvas. La marca del navbar aparece recién al scrollear (no compite
  con el hero).
- **Roll de créditos** (ESC. 05): la ficha técnica rueda scrubbed dentro
  de un viewport enmascarado.
- **Sonido de sala**: toggle "SALA" en el HUD (WebAudio sintetizado, sin
  assets; room tone + click de proyector al cambiar de escena). Off por
  defecto.
- **Atmósfera**: polvo dorado en canvas (hero, desktop), light sweep entre
  escenas, scramble de rótulos, grano, viñeta, luz de cursor.

Todo respeta `prefers-reduced-motion` (los efectos se apagan) y los
efectos pesados quedan fuera de mobile.

## Notas

- Los PNG de `logos_aurum/` traían el damero de transparencia horneado;
  las versiones de `public/` fueron procesadas (chroma-key) para tener
  alfa real y pesar 10–20× menos.
- `prefers-reduced-motion` desactiva smooth scroll, grano animado y
  reveals; el contenido queda accesible de forma estática.
- Si la URL llega con un `#hash` (deep link), la placa de apertura se
  saltea y se navega directo a la sección.
- El formulario de aplicación abre el cliente de correo del visitante
  con un mail pre-armado a hello@aurumvisual.com (no requiere backend).
