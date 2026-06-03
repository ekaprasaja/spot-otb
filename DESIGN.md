---
name: Surgical Precision
colors:
  surface: '#10131b'
  surface-dim: '#10131b'
  surface-bright: '#363942'
  surface-container-lowest: '#0b0e16'
  surface-container-low: '#181b23'
  surface-container: '#1c1f28'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e0e2ed'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e0e2ed'
  inverse-on-surface: '#2d3039'
  outline: '#8b90a1'
  outline-variant: '#414755'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6a'
  primary-container: '#4f8eff'
  on-primary-container: '#00275e'
  inverse-primary: '#005ac4'
  secondary: '#b9c7e4'
  on-secondary: '#233148'
  secondary-container: '#3c4962'
  on-secondary-container: '#abb9d6'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#f0661b'
  on-tertiary-container: '#4d1900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004396'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#b9c7e4'
  on-secondary-fixed: '#0d1c32'
  on-secondary-fixed-variant: '#39475f'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#10131b'
  on-background: '#e0e2ed'
  surface-variant: '#32353d'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style
This design system is built on the pillars of **Surgical Precision**. It targets orthopedic surgeons and medical executives who demand data integrity and high-performance branding tools. The aesthetic is a fusion of medical-grade reliability and high-tech futurism.

The core style is **Glassmorphism**, utilized to create a sense of depth and clarity. By layering translucent surfaces over a deep, dark canvas, the interface mimics the sophisticated displays of modern surgical navigation systems. This approach ensures that complex data remains legible while feeling premium and authoritative. The emotional response is one of absolute control, technical mastery, and professional excellence.

## Colors
The palette is dominated by **Deep Navy (#0A192F)**, serving as the foundational void that reduces eye strain and provides a high-contrast backdrop for medical data. **Electric Blue (#0077FF)** acts as the "Active Laser"—reserved exclusively for primary actions, progress indicators, and critical focus points.

**Clean White** is used for primary typography and high-contrast iconography to ensure maximum readability. For layered elements, the system uses varying opacities of white to create "frosted" surfaces, allowing the deep background to subtly bleed through. Status colors (Success, Warning, Error) should follow medical standards but be desaturated to fit the dark aesthetic.

## Typography
This design system utilizes **Inter** for its systematic, utilitarian, and highly legible qualities. The typographic scale is optimized for high-density data displays. 

Headlines are tight and bold to convey authority. Body text maintains generous line heights to ensure clinical reports and branding strategies are easy to parse. A special "Label-Caps" style is used for metadata and category headers to provide a structural, "instrument panel" feel. Monospaced numeric fonts should be used within data tables and progress rings to prevent layout shifting during real-time updates.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for dashboard views, ensuring that diagnostic tools and charts remain in a predictable, stable position. A 12-column system is used for wide-screen desktop applications, while a tight 4-column system is used for mobile clinical reviews.

Spacing is disciplined and mathematical, based on an 8px baseline. Large margins (32px+) are used to separate major functional modules, creating "islands" of information. High-density data components use the "sm" (12px) spacing unit to maximize information density without sacrificing clarity.

## Elevation & Depth
In this design system, depth is achieved through **Glassmorphism and Tonal Layering** rather than traditional heavy shadows.

1.  **Base Layer:** Deep Navy (#0A192F) solid background.
2.  **Mid Layer (Cards/Panels):** Semi-transparent white fill (4-8%) with a `backdrop-filter: blur(12px)`. Borders are 1px thick, semi-transparent white (10-15%) to create a "glass edge" effect.
3.  **Top Layer (Modals/Tooltips):** Higher transparency (12-16% fill) with a more aggressive blur (20px) and a very subtle, large-radius ambient shadow (Blue-tinted, 40% opacity) to signify immediate focus.

Depth conveys the "priority of intervention"—the more elevated an object, the more immediate the required action.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. This avoids the clinical "coldness" of sharp corners while maintaining a professional, engineered appearance. Large containers (Cards) use a `0.75rem` radius, while interactive elements like buttons and input fields use a `0.25rem` radius. Progress rings and data points may use circular (pill) shapes to differentiate them from structural layout containers.

## Components
- **Buttons:** Primary buttons use a solid Electric Blue fill with white text. Secondary buttons are "ghost" style with a 1px Electric Blue border and glass background. Micro-interactions should include a subtle "glow" expand on hover.
- **Data Visualizations:** Charts must use Electric Blue as the primary data line. Use thin, 1px grid lines in low-opacity white. Progress rings should use a "glow" effect on the leading edge of the stroke to simulate a laser-cutting path.
- **Glass Cards:** All content containers must feature the frosted glass effect. Headers within cards should be separated by a subtle 1px horizontal line.
- **Input Fields:** Use a dark, recessed background with a 1px border that glows Electric Blue upon focus. Placeholder text should be low-contrast white.
- **Micro-interactions:** Transitions should be fast (150ms-200ms) with a `cubic-bezier(0.4, 0, 0.2, 1)` easing, mimicking the swift, precise movement of surgical tools.
- **Additional Components:** "Pulse" indicators for AI-processing states, high-density data tables with hover-state row highlighting, and "Anatomy Selectors" (interactive skeletal maps).
