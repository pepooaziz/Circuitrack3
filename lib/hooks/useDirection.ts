import { useMemo } from 'react';

export interface DirectionConfig {
    dir: 'rtl' | 'ltr';
    isRTL: boolean;
    isLTR: boolean;
    textAlign: 'right' | 'left';
    flexDirection: 'row' | 'row-reverse';
}

/**
 * Hook to get direction configuration based on language
 * @param lang - Language code (ar, en, zh)
 * @returns Direction configuration object
 */
export function useDirection(lang: string): DirectionConfig {
    return useMemo(() => {
        const isRTL = lang === 'ar';

        return {
            dir: isRTL ? 'rtl' : 'ltr',
            isRTL,
            isLTR: !isRTL,
            textAlign: isRTL ? 'right' : 'left',
            flexDirection: isRTL ? 'row-reverse' : 'row',
        };
    }, [lang]);
}

/**
 * Get direction string for HTML dir attribute
 * @param lang - Language code
 * @returns 'rtl' or 'ltr'
 */
export function getDirection(lang: string): 'rtl' | 'ltr' {
    return lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Check if language is RTL
 * @param lang - Language code
 * @returns true if RTL, false otherwise
 */
export function isRTL(lang: string): boolean {
    return lang === 'ar';
}
