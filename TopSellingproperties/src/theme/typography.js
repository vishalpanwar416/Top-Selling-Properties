// Typography System for Property App
// Centralized font definitions for consistent typography across the application

export const fontFamilies = {
    // Lato Font Family Variants
    thin: 'Lato_100Thin',
    light: 'Lato_300Light',
    regular: 'Lato_400Regular',
    medium: 'Lato_400Regular', // Lato doesn't have medium, using regular
    semiBold: 'Lato_700Bold', // Using bold as semiBold
    bold: 'Lato_700Bold',
    extraBold: 'Lato_900Black',
    black: 'Lato_900Black',
};

export const fontSizes = {
    // Extra Small - Badges, Tags, Micro Text (MakeMyTrip style)
    xs: 10,
    xs2: 11,
    xs3: 12,
    
    // Small - Labels, Secondary Text, Small Buttons
    sm: 13,
    sm2: 14,
    
    // Medium - Body Text, Buttons, Standard Text
    md: 15,
    md2: 16,
    
    // Large - Titles, Headings, Important Text
    lg: 17,
    lg2: 18,
    lg3: 19,
    
    // Extra Large - Main Titles, Hero Text, Prices
    xl: 20,
    xl2: 22,
    xl3: 24,
    
    // Display - Large Headers
    display: 26,
    display2: 28,
};

export const lineHeights = {
    tight: 18,
    normal: 20,
    relaxed: 22,
    loose: 24,
    extraLoose: 28,
};

export const letterSpacing = {
    tight: -0.5,
    normal: -0.3,
    relaxed: -0.2,
    loose: 0,
    wide: 0.2,
    wider: 0.3,
    widest: 0.5,
};

// Pre-defined Typography Styles
export const typography = {
    // Display Styles
    display: {
        fontSize: fontSizes.display2,
        fontFamily: fontFamilies.extraBold,
        lineHeight: lineHeights.extraLoose,
        letterSpacing: letterSpacing.tight,
    },
    
    // Headings
    h1: {
        fontSize: fontSizes.xl2,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.loose,
        letterSpacing: letterSpacing.tight,
    },
    h2: {
        fontSize: fontSizes.xl,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.loose,
        letterSpacing: letterSpacing.normal,
    },
    h3: {
        fontSize: fontSizes.lg3,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    h4: {
        fontSize: fontSizes.lg2,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    h5: {
        fontSize: fontSizes.lg,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    h6: {
        fontSize: fontSizes.md2,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    
    // Body Text
    body: {
        fontSize: fontSizes.md,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.loose,
    },
    bodySmall: {
        fontSize: fontSizes.sm2,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    bodyLarge: {
        fontSize: fontSizes.md2,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.loose,
    },
    
    // Labels & Captions
    label: {
        fontSize: fontSizes.sm,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    labelSmall: {
        fontSize: fontSizes.xs3,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.loose,
    },
    caption: {
        fontSize: fontSizes.xs2,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.loose,
    },
    captionSmall: {
        fontSize: fontSizes.xs,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.loose,
    },
    
    // Buttons
    button: {
        fontSize: fontSizes.md,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    buttonSmall: {
        fontSize: fontSizes.sm2,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    buttonLarge: {
        fontSize: fontSizes.md2,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    
    // Special Styles - MakeMyTrip Style
    price: {
        fontSize: fontSizes.xl,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.tight,
    },
    priceLarge: {
        fontSize: fontSizes.xl2,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.tight,
    },
    pricePerNight: {
        fontSize: fontSizes.sm,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    badge: {
        fontSize: fontSizes.xs2,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wider,
    },
    badgeSmall: {
        fontSize: fontSizes.xs,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
    rating: {
        fontSize: fontSizes.md,
        fontFamily: fontFamilies.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    ratingLabel: {
        fontSize: fontSizes.sm,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    propertyTitle: {
        fontSize: fontSizes.md2,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    title: {
        fontSize: fontSizes.md,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    subtitle: {
        fontSize: fontSizes.sm2,
        fontFamily: fontFamilies.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.loose,
    },
    overline: {
        fontSize: fontSizes.xs3,
        fontFamily: fontFamilies.semiBold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.widest,
    },
};

// Helper function to create custom typography style
export const createTypography = (size, family, lineHeight, letterSpacing) => ({
    fontSize: size,
    fontFamily: family,
    lineHeight: lineHeight,
    letterSpacing: letterSpacing,
});

export default typography;

