/**
 * Utility for rendering text as SVG using the Carattere font
 * This uses SVG <text> elements with the Carattere font from Google Fonts
 * for a beautiful handwritten appearance
 */

/**
 * Generate SVG text element data for the given text
 * @param text - The text to render
 * @param options - Optional configuration
 * @returns Object containing SVG viewBox and text element properties
 */
export const generateSvgTextData = (
    text: string,
    options?: {
        fontSize?: number;
        letterSpacing?: number;
    }
): {
    viewBox: string;
    fontSize: number;
    letterSpacing: number;
    textAnchor: string;
} => {
    const fontSize = options?.fontSize || 72;
    const letterSpacing = options?.letterSpacing || 2;

    // Estimate width based on character count and font size
    // Carattere is a cursive font, so characters are wider
    const estimatedWidth = text.length * fontSize * 0.6;
    const height = fontSize * 1.5;

    return {
        viewBox: `0 0 ${estimatedWidth} ${height}`,
        fontSize,
        letterSpacing,
        textAnchor: 'middle',
    };
};

/**
 * Get estimated dimensions for text rendered in Carattere font
 * @param text - The text to measure
 * @param fontSize - Font size to use
 * @returns Estimated width and height
 */
export const getTextDimensions = (
    text: string,
    fontSize: number = 72
): { width: number; height: number } => {
    // Carattere is a cursive font with wider characters
    const width = text.length * fontSize * 0.6;
    const height = fontSize * 1.5;

    return { width, height };
};
