export type ThemeType = 'classic' | 'festival-civic' | 'charcoal-grid' | 'copper-lecture' | 'mint-campaign';

export const VALID_THEMES: ThemeType[] = [
    'classic',
    'festival-civic',
    'charcoal-grid',
    'copper-lecture',
    'mint-campaign'
];

export const THEME_SHORT_MAP: Record<string, string> = {
    festival: 'festival-civic',
    charcoal: 'charcoal-grid',
    mint: 'mint-campaign',
    copper: 'copper-lecture',
    default: 'classic', // legacy/fallback
};
