export const WORKFLOW_IDS = [
  'preference_evaluation',
  'single_video_qc',
  'event_temporal_annotation',
  'prompt_adherence',
  'continuity_coherence',
  'style_consistency',
  'audio_visual_sync',
  'physics_behavior',
  'safety_compliance',
  'adversarial_red_team',
]

export const WORKFLOWS = [
  { id: 'preference_evaluation', number: 1, title: 'Preference Evaluation', tagline: 'Compará outputs y defendé una preferencia.', media: 'comparison', tier: 'core' },
  { id: 'single_video_qc', number: 2, title: 'Single Video QC', tagline: 'Decidí si un video sirve y documentá sus fallas.', media: 'single', tier: 'core' },
  { id: 'event_temporal_annotation', number: 3, title: 'Event & Temporal Annotation', tagline: 'Describí qué ocurre y en qué momento.', media: 'single', tier: 'core' },
  { id: 'prompt_adherence', number: 4, title: 'Prompt Adherence', tagline: 'Medí cuánto cumple el video la instrucción.', media: 'single', tier: 'core' },
  { id: 'continuity_coherence', number: 5, title: 'Continuity & Multi-Clip Coherence', tagline: 'Evaluá si los planos sostienen una escena.', media: 'multi', tier: 'core' },
  { id: 'style_consistency', number: 6, title: 'Style / Brand Consistency', tagline: 'Revisá lenguaje visual, marca y cinematografía.', media: 'single', tier: 'core' },
  { id: 'audio_visual_sync', number: 7, title: 'Audio-Visual Sync', tagline: 'Medí la alineación entre imagen y sonido.', media: 'single', tier: 'premium' },
  { id: 'physics_behavior', number: 8, title: 'Physics & Behavior Plausibility', tagline: 'Detectá interacciones físicamente imposibles.', media: 'single', tier: 'premium' },
  { id: 'safety_compliance', number: 9, title: 'Safety & Compliance Audit', tagline: 'Auditá riesgo, política y aptitud de publicación.', media: 'single', tier: 'premium' },
  { id: 'adversarial_red_team', number: 10, title: 'Adversarial Red Teaming', tagline: 'Provocá y documentá fallas reproducibles.', media: 'single', tier: 'premium' },
]

export const DEFAULT_RUBRICS = {
  preference_evaluation: ['Temporal Consistency', 'Motion / Physics', 'Prompt Adherence', 'Cinematic Quality', 'Production Readiness'],
  single_video_qc: ['Overall Quality', 'Production Readiness', 'Temporal Consistency', 'Motion / Physics', 'Visual Artifacts'],
  event_temporal_annotation: [],
  prompt_adherence: ['Subject', 'Action', 'Setting', 'Camera', 'Style'],
  continuity_coherence: ['Character', 'Wardrobe', 'Objects', 'Lighting', 'Spatial', 'Action'],
  style_consistency: ['Color Palette', 'Lighting', 'Composition', 'Camera Language', 'Mood', 'Brand Alignment'],
  audio_visual_sync: ['Lip Sync', 'Sound Event Sync', 'Temporal Offset'],
  physics_behavior: ['Contact', 'Gravity', 'Material', 'Motion', 'Behavior'],
  safety_compliance: ['Brand Safety', 'IP', 'Sensitive Content', 'Policy Compliance'],
  adversarial_red_team: ['Reproducibility', 'Severity', 'Model Robustness'],
}

export const DEFAULT_REASONS = {
  preference_evaluation: ['Mayor consistencia temporal', 'Mejor adherencia al prompt', 'Movimiento más plausible', 'Mayor calidad cinematográfica', 'Más listo para producción'],
}

export const CODEX_SEED = [
  ['temporal-flicker', 'Technical Artifacts', 'Temporal Flicker', 'El brillo o la textura parpadean entre frames.', 'Usalo cuando el cambio no pertenece a una fuente de luz de la escena.', 'No usar para luces diegéticas que titilan.', 'medium'],
  ['morphing-artifact', 'Technical Artifacts', 'Morphing Artifact', 'Un objeto se derrite, fusiona o transforma de forma no física.', 'Usalo cuando la geometría cambia sin una causa narrativa.', 'No usar si el prompt pidió la transformación.', 'high'],
  ['compression-artifact', 'Technical Artifacts', 'Compression Artifact', 'Bloques o degradación causada por compresión.', 'Usalo cuando hay macroblocking localizado y visible.', 'No usar para grano estilístico.', 'low'],
  ['identity-drift', 'Temporal Coherence', 'Identity Drift', 'La identidad de una persona cambia durante el plano.', 'Usalo cuando los rasgos dejan de pertenecer al mismo sujeto.', 'No usar para un corte intencional a otra persona.', 'high'],
  ['object-permanence-failure', 'Temporal Coherence', 'Object Permanence Failure', 'Un objeto aparece, desaparece o se teletransporta.', 'Usalo cuando no existe corte ni oclusión que lo explique.', 'No usar si el objeto salió naturalmente de cuadro.', 'high'],
  ['background-inconsistency', 'Temporal Coherence', 'Background Inconsistency', 'El fondo cambia independientemente de la cámara.', 'Usalo para texturas o elementos que mutan sin causa.', 'No usar para elementos animados de la escena.', 'medium'],
  ['melted-hands', 'Anatomy & Human Body', 'Melted / Fused Hands', 'Los dedos se fusionan o pierden estructura anatómica.', 'Usalo cuando la mano es suficientemente visible.', 'No usar si la mano está demasiado lejos u ocluida.', 'high'],
  ['face-deformation', 'Anatomy & Human Body', 'Face Deformation', 'Los rasgos faciales están deformados o desalineados.', 'Usalo cuando la deformación es clara y no estilística.', 'No usar para estilos cartoon o efectos pedidos.', 'high'],
  ['text-generation-failure', 'Text & Typography', 'Text Generation Failure', 'El texto visible es ilegible o contiene caracteres sin sentido.', 'Usalo cuando el texto debería poder leerse.', 'No usar para texto deliberadamente desenfocado.', 'high'],
  ['depth-inconsistency', 'Depth & Perspective', 'Depth Inconsistency', 'Los elementos rompen el orden esperado de profundidad.', 'Usalo cuando foreground y background se cruzan de forma imposible.', 'No usar para perspectiva estilizada intencional.', 'medium'],
  ['floating-objects', 'Depth & Perspective', 'Floating Objects', 'Un objeto parece flotar sin apoyo.', 'Usalo cuando debería existir contacto con una superficie.', 'No usar si el prompt establece levitación.', 'medium'],
  ['framing-jump', 'Scene Composition', 'Framing Jump', 'La composición salta dentro de un plano continuo.', 'Usalo para cambios bruscos sin corte.', 'No usar cuando hay un corte explícito.', 'high'],
  ['hand-object-failure', 'Physics & Behavior', 'Hand-Object Failure', 'Una mano atraviesa o sostiene mal un objeto.', 'Usalo cuando el contacto es físicamente imposible.', 'No usar si la oclusión vuelve ambiguo el contacto.', 'high'],
  ['gravity-violation', 'Physics & Behavior', 'Gravity Violation', 'Un objeto ignora la gravedad esperada.', 'Usalo cuando flota o cae en dirección imposible.', 'No usar en escenas con gravedad alterada.', 'high'],
  ['lighting-inconsistency', 'Lighting', 'Lighting Inconsistency', 'La dirección o intensidad de luz contradice la escena.', 'Usalo cuando no hay una fuente que explique el cambio.', 'No usar si una fuente visible lo justifica.', 'medium'],
  ['shadow-direction-mismatch', 'Lighting', 'Shadow Direction Mismatch', 'La sombra contradice la fuente principal.', 'Usalo cuando dirección y fuente son incompatibles.', 'No usar si hay varias fuentes plausibles.', 'medium'],
  ['color-banding', 'Color & Grade', 'Color Banding', 'Se ven escalones en un gradiente que debería ser suave.', 'Usalo cuando las bandas son visibles a tamaño normal.', 'No usar para estética pixelada intencional.', 'low'],
  ['sub-frame-jitter', 'Motion', 'Sub-frame Jitter', 'Un objeto vibra uno o dos píxeles sin causa.', 'Usalo para micro-movimiento temporal no motivado.', 'No usar cuando existe vibración real en escena.', 'low'],
  ['prompt-omission', 'Prompt Adherence', 'Prompt Omission', 'Falta un elemento requerido por el prompt.', 'Usalo cuando el requisito es explícito.', 'No usar para elementos opcionales o ambiguos.', 'high'],
  ['action-mismatch', 'Prompt Adherence', 'Action Mismatch', 'La acción no coincide con la solicitada.', 'Usalo cuando el sujeto ejecuta otra acción.', 'No usar para variaciones menores de ejecución.', 'high'],
].map(([id, category, label, definition, useWhen, doNotUseWhen, defaultSeverity]) => ({
  id, category, label, definition, useWhen, doNotUseWhen, defaultSeverity,
}))

export function workflowById(id) {
  return WORKFLOWS.find((workflow) => workflow.id === id) || null
}

export function createWorkflowConfigs() {
  return Object.fromEntries(WORKFLOWS.map((workflow) => [workflow.id, {
    workflowId: workflow.id,
    enabled: true,
    rubricDimensions: DEFAULT_RUBRICS[workflow.id] || [],
    primaryReasons: DEFAULT_REASONS[workflow.id] || [],
    codexCategories: [],
    artifactTaxonomy: [],
    updatedAt: new Date(0).toISOString(),
  }]))
}
