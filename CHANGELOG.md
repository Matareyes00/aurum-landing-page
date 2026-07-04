# Aurum Landing Page — Changelog

## Versión Final: Landing Page Completa

### 🏗️ Stack Técnico

- **Frontend**: Vite + React + TypeScript/JSX
- **Animaciones**: GSAP (ScrollTrigger), Lenis (smooth scroll)
- **Gráficos**: Canvas (particles), CSS (cinematografía)
- **Audio**: Web Audio API (síntesis de sala + click de proyector)
- **Build**: Vite (dev + production)
- **Deploy**: Vercel-ready

### ✨ Características Principales

#### 1. **Secuencia de Apertura (Ident)**
- Countdown 3...2... con SVG stroke animation
- Marca AURUM + "VISUAL PRESENTA" con fade + scale
- Flicker de luz (simulando proyector)
- Transición a letterbox
- Skip interactivo (click) o automático (sessionStorage)

#### 2. **Hero Cinematográfico**
- **Wordmark auténtico**: AURUM extraído del logo original (PNG, no tipografía)
- **Atmósfera**: Key light dorado entrando desde izquierda + breathing beam diagonal + floor pool lighting
- **Dust particles**: Polvo flotante en capas de profundidad (canvas)
- **Sheen/foil effect**: Barrido de luz sobre letterforms (7s cycle, masked a la forma del wordmark)
- **Tesis**: "La máquina ya aprendió a generar. Todavía no aprendió a mirar."
- **CTA dual**: "Quiero ser parte" (gold) + "Ver cómo funciona" (ghost)

#### 3. **Mecanismo de Evaluación (Scrub Section)**
- **Desktop**: Viewer con OSD annotations (monitor de color grading)
  - Annotations sincronizadas con scroll (GSAP ScrollTrigger pinned)
  - Marca: color, continuidad, movimiento, luz, sonido
- **Mobile**: Mismo viewer + log de annotations below (responsive)
- **Visualización**: Mock-up de pantalla de trabajo con grid overlay

#### 4. **Cursor Cinematográfico**
- **Frame**: Cuatro esquinas que cierran al hovear sobre elementos interactivos
- **Light dot**: Centro brillante que aparece on click
- **Smooth follow**: Tracking de mouse con easing

#### 5. **Scroll Cinematográfico**
- **Lenis**: Scroll smooth natural (no janky)
- **Parallax**: Múltiples capas a diferentes velocidades
- **ScrollTrigger**: Reveals progresivos, scrub sections, pinned elements
- **Light sweep**: Barrido de luz dorada que cruza pantalla al entrar a cada escena

#### 6. **Rolling Credits**
- "TU PRÓXIMA PELÍCULA"
- Líneas de crédito tipo película con énfasis en "Financiación — Tu ojo"
- Scroll vertical sincronizado

#### 7. **Marquee Animado**
- Términos de cine en loop horizontal: "Encuadre", "Continuidad", "Luz", "Sonido", etc.
- Velocidad constante, dirección cíclica

#### 8. **Letterbox Dinámico**
- Barras 2.39:1 que aparecen/desaparecen según contexto
- Triggered por eventos (enter/exit scenes)
- Efecto cinematic immersion

#### 9. **Audio Sintetizado**
- **Room tone**: Ruido rosa filtrado + flutter LFO (simulando proyector)
- **Click/thump**: Sonido mecánico de proyector al abrir/cerrar
- Síntesis con osciladores Web Audio API

#### 10. **Text Scramble**
- Rótulos de escena ("ESC. 01", "ESC. 02") se "descodifican" al scrollear
- Efecto de revelado progresivo

---

## 📝 Secciones de Contenido

### ESC. 00 — Hero
- Brand introduction
- Descriptor + thesis line
- Copy relevante a la propuesta de valor
- CTA principal

### ESC. 01 — Tension ("La escena que conocés")
- Screenplay snippet
- Análisis de problemas en video generativo
- Pullquote sobre lo que falta

### ESC. 02 — Marquee
- Loop de términos cinematográficos
- Transición visual

### ESC. 03 — Mechanism ("El trabajo")
- Detalles del proceso de evaluación
- Desktop: scrub viewer con annotations
- Mobile: viewer + annotation log
- Role cards (CAM A, CAM B, CAM C, CAM D)

### ESC. 04 — Process ("El recorrido — travelling")
- Horizontal scroll de 3 pasos: Aplicás, Calibrás, Evaluás
- Animación de transición entre pasos

### ESC. 05 — Community ("La comunidad")
- 3 pilares: Referentes (industry figureheads), Foro (peer learning), Mesa de crítica (discussion)
- Copy que enfatiza comunidad real vs plataforma fría

### ESC. 06 — Promise ("La promesa")
- Rolling credits estilo película
- "TU PRÓXIMA PELÍCULA" como headline
- "Financiación — Tu ojo" destacado

### ESC. 07 — Apply
- Form: name, role (dropdown), email, portfolio URL, message
- Submit button
- Success/error states

### Footer
- Lockup de Aurum
- Tagline
- Metadata (copyright, email)

---

## 🔧 Cambios Técnicos Principales

### Versión 4.0 — Hero Redesign (Wordmark Auténtico)

#### Problema Original
El hero inicial usaba **Cinzel** (tipografía) para renderizar "AURUM", pero:
- No reproducía fielmente los letterforms del logo original (especialmente la A con swash caligráfico)
- El color y composición no capturaban la materialidad del foil dorado
- AURUM quedaba relegado a navbar, no era protagonista del hero
- El 3D symbol competía visualmente con la marca

#### Solución
1. **Extracción del wordmark**: Análisis de PNG columna por columna detectando columnas con tinta
2. **Cropping script** (crop-word.js):
   - Escanea lockup original identificando 3 segmentos (símbolo, AURUM, VISUAL)
   - Merges adjacent segments within 80px gap
   - Extrae con padding y preserva transparencia
3. **Archivos generados**:
   - `public/aurum-word.png` — AURUM solo (1019x266px, 270KB)
   - `public/aurum-visual-word.png` — AURUM VISUAL completo (1865x266px, 447KB)
4. **Componentes actualizados**:
   - Hero.jsx: `<h1>` contiene `<img src="/aurum-word.png">`
   - Ident.jsx: `<img src="/aurum-visual-word.png">`
   - Nav.jsx: Navbar wordmark a 13px con fade on scroll
5. **CSS sheen effect**:
   - ::after pseudo-element con gradient dorado
   - mask-image: radial-gradient para mantener form del wordmark
   - Animation: `brand-sheen` 7s infinite
   - Drop-shadow dorado para halo

#### Resultado
- Wordmark auténtico con materialidad original
- AURUM como protagonista indisputable
- Foil texture del logo se lee en hero (vetas, reflejos irregulares)
- Tipografía Cinzel ahora usada solo en headlines de apoyo (roles, "TU PRÓXIMA PELÍCULA")

---

### Versión 3.0 — Hero Atmosférico (Pre-Wordmark)

#### Problema
- 3D rotating symbol (Three.js) en perspectiva leía como "cubo azteca", no como obturador
- Tres.js + Symbol3D: 130KB penalty gzip innecesario
- Hero typography/color split (Cinzel texto amarillo + símbolo 3D) perdía jerarquía de marca

#### Solución
1. **Removido Three.js**: Uninstall, eliminado Symbol3D.jsx de imports
2. **Atmósfera cinematográfica pura**:
   - `.hero-key`: Key light dorado entrando desde izquierda (animated position)
   - `.hero-beam`: Diagonal breathing beam (hero-beam animation)
   - `.hero-floor`: Pool de luz en piso (simula proyector room)
   - `.hero-atmos`: Parallax container (yPercent: 14 on scroll)
3. **Dust particles**: Canvas-based floating polvo en hero (Dust.jsx)
4. **Resultado**: Leemos "sala de cine/proyección" no "cubo", gusto respetado

---

### Versión 2.0 — Feature Complete (Before Hero Redesign)

#### Features Implementadas
- ✅ Ident countdown + letter reveal
- ✅ Hero with 3D symbol (TBD: redesign)
- ✅ Mechanism scrub viewer (desktop) + annotation log (mobile)
- ✅ Cursor frame effect
- ✅ Letterbox dinámico
- ✅ Light sweep transitions
- ✅ Rolling credits
- ✅ Marquee loop
- ✅ Process horizontal scroll
- ✅ Community pillars
- ✅ Audio synth (room tone + projector click)
- ✅ Text scramble on scroll

#### Copy Refinement
- Removido repetición de "Tu ojo" (solo hero + promise section)
- Reframed precarity language en Tension (dignidad, no romanticismo)
- Clarified mechanism section (emphasis on "doble formación")

---

## 📦 Assets

### Logos
- `public/symbol-small.png` — Symbol hero-sized
- `public/symbol-mid.png` — Symbol for sections
- `public/symbol-footer.png` — Symbol footer
- `public/aurum-word.png` — Wordmark "AURUM" (extracted v4.0)
- `public/aurum-visual-word.png` — Full lockup "AURUM VISUAL" (extracted v4.0)

### Social
- `public/og.png` — Open Graph preview (800x800)
- `public/favicon.png` — Browser tab icon (64x64)

---

## 🎨 Design System

### Color Palette
- **Primary Black**: `#070503` (almost pure black, slightly warm)
- **Primary Gold**: `#d4a94e` (foil-inspired, warm/muted)
- **Ivory**: `#f5f0e8` (off-white, warm undertone)
- **Muted Tones**: `#4a4644`, `#6b6560`, `#8b8580` (mid-grays)

### Typography
- **Display Serif**: Cormorant Garamond (headlines, elegant)
- **Display Serif Alt**: Cinzel / Trajan (accent, classic)
- **Monospace**: Courier Prime (technical, screenplays)
- **Body**: Inter (clean, readable)

### Responsive Breakpoints
- **Desktop**: > 900px
- **Mobile**: ≤ 900px

### Accessibility
- `prefers-reduced-motion`: Media query respects
  - No animation on ident if reduced motion enabled
  - Dust particles disabled
  - Beam animation disabled

---

## 🚀 Build & Deploy

### Development
```bash
npm install
npm run dev  # Vite dev server on port 5173
```

### Production
```bash
npm run build  # Output: dist/
npm run preview  # Preview build on port 4173
```

### Deployment
- Vercel-ready (vite.config.js configured)
- No env variables required
- Static hosting (all assets in public/)
- Build output: ~314KB main JS + CSS gzip

---

## 🔍 Quality Assurance

### Desktop Verification
- ✅ All sections render correctly
- ✅ Animations smooth (no jank)
- ✅ Scroll behavior natural (Lenis)
- ✅ Cursor frame responsive
- ✅ Wordmark displays authentically
- ✅ Audio synthesizes without console errors

### Mobile Verification
- ✅ Responsive layout (< 900px)
- ✅ Touch events handled
- ✅ Annotation log readable
- ✅ CTA buttons accessible
- ✅ No horizontal scrolling

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 📋 File Structure

```
aurum-landing-page/
├── index.html                 # Entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
├── CHANGELOG.md              # This file
├── DESARROLLO.md             # Development notes (Spanish)
├── README.md                 # Brand brief (original)
├── src/
│   ├── main.jsx             # React root
│   ├── App.jsx              # Main orchestrator (Lenis, GSAP, nav)
│   ├── components/
│   │   ├── Hero.jsx         # Hero section with wordmark
│   │   ├── Ident.jsx        # Opening ident sequence
│   │   ├── Nav.jsx          # Fixed navbar
│   │   ├── Tension.jsx      # ESC. 01 screenplay
│   │   ├── Marquee.jsx      # ESC. 02 cinema terms loop
│   │   ├── Mechanism.jsx    # ESC. 03 scrub viewer + roles
│   │   ├── Process.jsx      # ESC. 04 horizontal scroll
│   │   ├── Community.jsx    # ESC. 05 three pillars
│   │   ├── Promise.jsx      # ESC. 06 rolling credits
│   │   ├── Apply.jsx        # ESC. 07 application form
│   │   └── Footer.jsx       # Footer
│   ├── fx/
│   │   ├── CursorFrame.jsx  # Cursor bracket effect
│   │   ├── Dust.jsx         # Particle system (canvas)
│   │   ├── Letterbox.jsx    # 2.39:1 bars
│   │   ├── LightSweep.jsx   # Golden light transition
│   │   ├── sound.js         # Web Audio synthesis
│   │   └── scramble.js      # Text scramble effect
│   └── styles/
│       └── global.css       # Complete design system (~6000 lines)
└── public/
    ├── symbol-*.png        # Symbol assets
    ├── aurum-word.png      # Wordmark (new v4.0)
    ├── aurum-visual-word.png # Full lockup (new v4.0)
    ├── og.png              # Social preview
    └── favicon.png         # Browser icon
```

---

## 🎬 The Why

This landing page doesn't just *look* cinematic—it *is* cinematic. Every effect, animation, and interaction serves the brand's core message: we understand filmmaking, we respect the craft, and we're here to bridge the gap between artistic vision and financial reality.

The wordmark is authentic because cineastes notice details. The atmosphere is carefully lit because photographers understand light. The scroll feels like a camera movement because this is how film thinks.

Aurum me entiende — that's the promise. And this page proves it.

---

**Built with**: React, GSAP, Lenis, Web Audio, Canvas, CSS artistry  
**Deploy**: Ready for Vercel  
**Version**: 4.0 (Wordmark Authentic)  
**Last Updated**: July 3, 2026
