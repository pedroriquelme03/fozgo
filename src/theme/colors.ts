/**
 * FozGo — paleta de marca.
 * Inspirada na logo (azul-marinho "FOZ" + teal "GO" + pin verde) e nas águas
 * das Cataratas do Iguaçu. Tema "Vibrant & Block-based" do design system.
 */
export const colors = {
  // Marca
  navy: '#123A5B', // FOZ / títulos e texto forte
  navyDeep: '#0C2A43',
  teal: '#0EA5B7', // GO / cor primária de ação
  tealDeep: '#0E7C8B',
  tealSoft: '#E1F5F7',
  pin: '#34C759', // verde do pin

  // Base / superfícies
  background: '#F5FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#EFF6F8',
  overlay: 'rgba(12, 42, 67, 0.55)',

  // Texto
  text: '#0F2438',
  textMuted: '#5B7183',
  textFaint: '#9AAAB6',
  onPrimary: '#FFFFFF',

  // Linhas
  border: '#E3ECEF',
  borderStrong: '#CFDDE2',

  // Feedback
  star: '#FFB020',
  danger: '#E5484D',
  success: '#34C759',

  // Sombras
  shadow: '#0C2A43',
} as const;

/** Cores por categoria — cada categoria tem um tom para chip/ícone. */
export const categoryColors = {
  restaurantes: { base: '#F97316', tint: '#FFF1E8' },
  cafes: { base: '#B4632B', tint: '#F7EDE4' },
  bares: { base: '#7C3AED', tint: '#F1EAFE' },
  pontos: { base: '#0EA5B7', tint: '#E1F5F7' },
  hoteis: { base: '#2563EB', tint: '#E7EEFE' },
  passeios: { base: '#16A34A', tint: '#E6F6EC' },
  clima: { base: '#0284C7', tint: '#E0F2FE' },
  transporte: { base: '#4F46E5', tint: '#ECEBFE' },
  guias: { base: '#0891B2', tint: '#DEF3F8' },
  ingressos: { base: '#E11D48', tint: '#FFE4EA' },
} as const;

export type ColorToken = keyof typeof colors;
