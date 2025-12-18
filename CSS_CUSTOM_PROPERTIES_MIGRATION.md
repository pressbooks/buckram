# Buckram SCSS to CSS Custom Properties Migration Plan

## Overview

This document outlines the migration strategy for replacing SCSS variables and processing with CSS custom properties in Buckram, the shared component library for Pressbooks book themes.

## Background & Motivation

- Current system uses SCSSPHP library for runtime SCSS compilation
- SCSSPHP has maintenance/update issues and we're using SCSS in non-standard ways
- CSS custom properties (CSS variables) are now universally supported
- Would simplify the architecture and eliminate runtime SCSS compilation
- Better performance: no server-side compilation needed for many use cases

## Current Architecture

### SCSS Variables System
- **Location**: `assets/styles/variables/` directory
  - `_accessibility.scss`
  - `_colors.scss`
  - `_elements.scss`
  - `_media.scss`
  - `_pages.scss`
  - `_section-titles.scss`
  - `_specials.scss`
  - `_structure.scss`
  - `_toc.scss`

### Key SCSS Features Used
1. **Variables with !default** - Allow theme-level overrides
2. **Context-based maps** - Different values for `epub`, `prince`, `web` outputs:
   ```scss
   $body-font-size: (epub: medium, prince: 11pt, web: 14pt) !default;
   ```
3. **if-map-get() function** - Extracts context-specific values:
   ```scss
   font-size: if-map-get($body-font-size, $type);
   ```
4. **Dynamic imports** - Components conditionally included
5. **Complex functions** - Position calculations, etc.

### Current PHP/Sass Integration Points

#### 1. Container Service (`Pressbooks\Sass`)
- Path: `inc/class-sass.php`
- Manages SCSS compilation
- Key methods:
  - `setVariables()` - Injects PHP values into SCSS
  - `compile()` - Runs SCSSPHP compiler
  - `parseVariables()` - Reads SCSS variables back to PHP

#### 2. Theme Options → SCSS Pipeline
Located in `inc/modules/themeoptions/`:
- `class-pdfoptions.php`
- `class-ebookoptions.php`
- `class-weboptions.php`
- `class-globaloptions.php`

**Pattern Example:**
```php
// Theme option is stored in WordPress
$options = get_option('pressbooks_theme_options_pdf');

// Convert to SCSS variable via Sass service
$styles->getSass()->setVariables([
    'body-font-family' => $options['pdf_body_font_family'],
    'body-line-height' => "(epub: 1.4em, prince: {$lineheight}, web: 1.8em)",
]);

// SCSS is compiled with these variables
$css = $styles->customize('prince', $scss);
```

#### 3. Export System Integration
- Path: `inc/modules/export/prince/class-pdf.php`
- Generates CSS for PDF exports using PrinceXML
- Applies theme options as SCSS overrides before compilation

#### 4. GlobalTypography Service
- Path: `inc/class-globaltypography.php`
- Generates language-specific font SCSS
- Method: `_sassify()` creates SCSS files dynamically

## Migration Strategy

### Phase 1: Easy Variables → CSS Custom Properties

**Target**: Simple, single-value variables that don't use maps or context switching

#### Examples:
```scss
// BEFORE (SCSS)
$h1-font-style: normal !default;
$h1-font-weight: normal !default;
$h1-text-transform: uppercase !default;

// AFTER (CSS)
:root {
  --h1-font-style: var(--custom-h1-font-style, normal);
  --h1-font-weight: var(--custom-h1-font-weight, normal);
  --h1-text-transform: var(--custom-h1-text-transform, uppercase);
}

h1 {
  font-style: var(--h1-font-style);
  font-weight: var(--h1-font-weight);
  text-transform: var(--h1-text-transform);
}
```

**Theme Override Pattern:**
```css
/* In child theme */
:root {
  --custom-h1-font-weight: bold;
  --custom-h1-text-transform: none;
}
```

#### Variables to Migrate First:
1. **Color variables** - `_colors.scss`
   - Most are simple strings or keywords
   - Exception: Some use maps for context (epub vs web vs prince)
2. **Simple structure** - `_structure.scss`
   - Separator strings
   - Position keywords (where they're simple)
3. **Typography** - `_elements.scss`
   - Font families, styles, weights
   - Text transforms
   - Where NOT using context maps

### Phase 2: Context-Based Values (Maps)

**Challenge**: Handle epub/prince/web-specific values

#### Current Pattern:
```scss
$body-font-size: (epub: medium, prince: 11pt, web: 14pt) !default;

// Usage
body {
  font-size: if-map-get($body-font-size, $type);
}
```

#### Migration Approach A: CSS @media for Different Contexts
This won't work because epub/prince/web aren't true media queries.

#### Migration Approach B: Context-Specific CSS Files
Generate separate CSS files per context:

```css
/* buckram-web.css */
:root {
  --body-font-size-base: 14pt;
}

/* buckram-epub.css */  
:root {
  --body-font-size-base: medium;
}

/* buckram-prince.css */
:root {
  --body-font-size-base: 11pt;
}

/* buckram-common.css */
body {
  font-size: var(--body-font-size, var(--body-font-size-base));
}
```

**Build Process:**
- Maintain single source of truth for variable definitions
- Generate context-specific variable files at build time
- PHP chooses which file to load based on export type

#### Migration Approach C: Inline Styles for Exports
For PDF/EPUB exports:
- Base CSS uses default values via custom properties
- PHP injects context-specific overrides as inline `<style>` blocks
- Web version loads standard CSS with custom properties

```php
// In export routine
$customProps = ":root {\n";
$customProps .= "  --body-font-size: 11pt;\n";
$customProps .= "  --body-line-height: 1.4em;\n";
$customProps .= "}\n";
```

**Recommended: Approach B + C Hybrid**
- Use separate CSS files for major context switches
- Use inline styles for theme option overrides

### Phase 3: Theme Options → CSS Custom Properties API

**Challenge**: Replace `$styles->getSass()->setVariables()` pattern

#### Current Flow:
```
WordPress Options DB 
  → PHP reads options
  → Convert to SCSS variables
  → Compile SCSS with SCSSPHP
  → Output CSS
```

#### New Flow:
```
WordPress Options DB
  → PHP reads options
  → Convert to CSS custom property declarations
  → Inject into <style> block or generate CSS file
  → Output CSS with custom properties
```

#### Implementation:

**New Method in Styles Class:**
```php
// inc/class-styles.php

/**
 * Convert theme options to CSS custom properties
 * 
 * @param array $options Theme options array
 * @param string $context 'web', 'epub', or 'prince'
 * @return string CSS custom property declarations
 */
public function optionsToCssProperties( array $options, string $context = 'web' ): string {
    $props = [];
    
    // Map option keys to CSS custom property names
    $mapping = [
        'pdf_body_font_family' => '--body-font-family',
        'pdf_body_line_height' => '--body-line-height',
        'pdf_page_width' => '--page-width',
        'pdf_page_height' => '--page-height',
        // ... more mappings
    ];
    
    foreach ( $mapping as $option_key => $css_var ) {
        if ( isset( $options[ $option_key ] ) ) {
            $value = $this->sanitizeCssValue( $options[ $option_key ] );
            $props[] = "  {$css_var}: {$value};";
        }
    }
    
    if ( empty( $props ) ) {
        return '';
    }
    
    return ":root {\n" . implode( "\n", $props ) . "\n}\n";
}
```

**Replace in Theme Options Classes:**
```php
// BEFORE
$styles->getSass()->setVariables([
    'body-line-height' => "(epub: 1.4em, prince: $lineheight, web: 1.8em)",
]);

// AFTER
$customCss = $styles->optionsToCssProperties([
    'body_line_height' => $lineheight,
], 'prince');
```

### Phase 4: Export Routine Updates

**Files to Update:**
- `inc/modules/export/prince/class-pdf.php`
- `inc/modules/export/epub/class-epub.php`
- `inc/modules/export/epub/class-epub201.php`

#### Current SCSS Processing:
```php
// Build SCSS string
$scss = $this->getStyles();
$scss .= $this->themeOptionsOverrides();

// Compile
$css = $styles->customize('prince', $scss);

// Add to Prince
$prince->addStyleSheet($css);
```

#### New CSS Custom Properties Processing:
```php
// Load pre-compiled base CSS
$css = $this->getBaseStyles('prince'); // buckram-prince.css + theme CSS

// Generate custom property overrides from options
$customProps = $styles->optionsToCssProperties(
    get_option('pressbooks_theme_options_pdf'),
    'prince'
);

// Combine
$finalCss = $css . "\n" . $customProps;

// Add to Prince
$prince->addStyleSheet($finalCss);
```

**Key Benefit**: Eliminates runtime SCSS compilation, just string concatenation!

### Phase 5: Child Theme Updates

**Current Child Theme Pattern:**
```scss
// themes/pressbooks-sometheme/assets/styles/epub/style.scss

// Override Buckram variables
$body-font-family: 'Crimson Text', serif !default;
$h1-font-size: 2em !default;

// Import Buckram components
@import 'buckram/assets/styles/components/elements';
```

**New Pattern:**
```css
/* themes/pressbooks-sometheme/assets/styles/epub/style.css */

/* Override Buckram variables via custom properties */
:root {
  --custom-body-font-family: 'Crimson Text', serif;
  --custom-h1-font-size: 2em;
}

/* Import Buckram components */
@import 'buckram/assets/styles/buckram-epub.css';
```

**Build Process Changes:**
- Remove SCSS compilation from theme build
- Change from `.scss` to `.css` for theme stylesheets (where appropriate)
- Some themes may still use SCSS for their own features (mixins, nesting, etc.)
  - Can use PostCSS or modern CSS nesting instead
  - Or keep SCSS but just for theme-specific code, not Buckram integration

## Technical Considerations

### 1. The `if-map-get()` Function
Currently used throughout Buckram:
```scss
@function if-map-get($var, $type) {
  @if type-of($var) == "map" {
    @return map-get($var, $type);
  }
  @return $var;
}
```

**Replacement**: Context-specific CSS files eliminate the need for this function.

### 2. Complex Position Calculations
Some SCSS functions do complex string/position manipulations:
```scss
@function convert-position($page-position, $content-position) {
  // Complex logic to convert position names to CSS margin box names
  // e.g., 'top-outside' → '@top-left' or '@top-right' depending on page
}
```

**Strategy**: 
- Keep using SCSS for complex functions during build time
- But use it to generate static CSS output, not runtime compilation
- Or rewrite logic in PHP/JavaScript for the few places it's needed

### 3. Compatibility Mode
To support gradual migration:

```php
// In Styles class
public function isCssCustomPropertiesCompatible(): bool {
    $theme = wp_get_theme();
    $version = $theme->get('Version');
    // Check theme supports CSS custom properties
    return version_compare($version, '3.0.0', '>=');
}

// Use appropriate rendering
if ( $this->isCssCustomPropertiesCompatible() ) {
    $css = $this->renderWithCustomProperties();
} else {
    $css = $this->renderWithScss();
}
```

### 4. Shapeshifter Font Selector
Currently manipulates SCSS variables for font selection:
```php
$styles->getSass()->setVariables([
    'shapeshifter-font-1' => '"' . $font_name . '"',
    'shapeshifter-font-1-is-serif' => $is_serif_bool,
]);
```

**New approach**:
```php
$customProps = ":root {\n";
$customProps .= "  --body-font-family: \"{$font_name}\";\n";
$customProps .= "  --body-serif-fallback: " . ($is_serif ? 'serif' : 'sans-serif') . ";\n";
$customProps .= "}\n";
```

### 5. Browser Support
CSS Custom Properties are supported in:
- All modern browsers (Chrome, Firefox, Safari, Edge)
- PrinceXML 13+ (PDF generation)
- Most EPUB readers (some older ones may have issues)

**Fallback Strategy**: Provide static compiled values as fallbacks
```css
.body {
  font-size: 14pt; /* fallback */
  font-size: var(--body-font-size, 14pt);
}
```

## File Structure (Proposed)

```
buckram/
├── assets/
│   └── styles/
│       ├── buckram-web.css          # Compiled for web with web defaults
│       ├── buckram-epub.css         # Compiled for EPUB with epub defaults
│       ├── buckram-prince.css       # Compiled for PDF with prince defaults
│       ├── buckram-common.css       # Shared component styles
│       ├── variables/               # Source of truth for variables
│       │   ├── _variables.scss      # Still SCSS for build-time processing
│       │   └── README.md
│       ├── components/              # Component styles
│       │   ├── _elements.css        # Migrated to pure CSS with custom props
│       │   ├── _colors.css
│       │   └── ...
│       └── build/                   # Build scripts
│           └── generate-css-vars.js # Converts SCSS variables to CSS custom props
├── dist/                            # Build output
│   ├── buckram-web.css
│   ├── buckram-epub.css
│   └── buckram-prince.css
└── CSS_CUSTOM_PROPERTIES_MIGRATION.md
```

## Build Process

### Current:
1. Themes import Buckram SCSS files
2. Themes override variables
3. SCSSPHP compiles at runtime

### Proposed:
1. **Build time** (in Buckram):
   - Process variables file
   - Generate context-specific CSS files with custom property declarations
   - Compile component files to CSS
   - Output: `buckram-{context}.css` files
   
2. **Theme build time**:
   - Import pre-built Buckram CSS
   - Add theme-specific custom property overrides
   - Optionally use PostCSS for any theme-specific processing
   
3. **Runtime** (in Pressbooks):
   - Load appropriate Buckram CSS file
   - Generate custom property overrides from theme options
   - Inject as inline `<style>` or separate file

### Build Scripts:

```javascript
// buckram/build/generate-css-vars.js

const fs = require('fs');
const sass = require('sass');

// Parse SCSS variables file
const variables = sass.compile('assets/styles/variables/_variables.scss');

// Generate CSS custom properties for each context
const contexts = ['web', 'epub', 'prince'];
contexts.forEach(context => {
  const cssVars = generateCustomProperties(variables, context);
  fs.writeFileSync(`dist/variables-${context}.css`, cssVars);
});
```

## Testing Strategy

**See [TESTING_PLAN.md](TESTING_PLAN.md) for comprehensive testing documentation.**

### Unit Tests
- Test conversion of SCSS variables to CSS custom properties
- Test context-specific value resolution
- Test theme option to CSS property conversion
- Test page layout logic (recto/verso, blank pages)

### Integration Tests
- Test PDF export with custom properties
- Test EPUB export with custom properties
- Test web rendering with custom properties
- Test theme overrides work correctly
- Test cross-format consistency

### Visual Regression Tests
- Compare rendered output before/after migration
- Test across different themes
- Test across different export formats
- PDF page-by-page comparison
- Webbook screenshot comparison
- EPUB reader testing

### Format-Specific Testing
- **Webbooks:** Playwright tests, cross-browser, performance (Lighthouse)
- **PDF:** PrinceXML validation, layout verification, visual comparison
- **EPUB:** EPUBCheck validation, reader compatibility testing

## Rollout Plan

### Stage 1: Proof of Concept (Buckram)
- ✅ Review reference implementation
- ✅ Create migration documentation
- [ ] Implement Phase 1 for simple variables
- [ ] Create build script for CSS generation
- [ ] Test with one theme (McLuhan/pressbooks-book)
- [ ] Run initial test suite

### Stage 2: Core Integration (Pressbooks Plugin)
- [ ] Implement `optionsToCssProperties()` method
- [ ] Implement `PageLayout` service class
- [ ] Add compatibility mode check
- [ ] Update one theme options class (PDFOptions)
- [ ] Test theme options UI → CSS custom properties flow
- [ ] Run integration tests

### Stage 3: Export System Update
- [ ] Update PDF export to use CSS custom properties
- [ ] Move page layout logic to application layer
- [ ] Test PrinceXML compatibility
- [ ] Update EPUB export
- [ ] Test with multiple EPUB readers
- [ ] Run format-specific test suites

### Stage 4: Full Migration
- [ ] Migrate all Buckram variables
- [ ] Update all theme option classes
- [ ] Update all child themes
- [ ] Migrate all page layout logic
- [ ] Deprecate SCSS compilation code path
- [ ] Run full regression suite

### Stage 5: Cleanup & Documentation
- [ ] Remove SCSSPHP dependency (or keep for backward compat)
- [ ] Update documentation
- [ ] Update theme development guide
- [ ] Create migration guide for third-party theme developers
- [ ] Publish testing results

## Open Questions

1. **SCSSPHP Removal**: Do we completely remove SCSSPHP or keep for backward compatibility?
   - **Recommendation**: Keep for 1-2 major versions with deprecation notices

2. **Build Time vs Runtime**: Where do we draw the line?
   - **Recommendation**: Maximize build-time processing, minimize runtime

3. **Nested Contexts**: How do we handle themes that need to override specific contexts?
   - **Recommendation**: Allow theme to provide context-specific CSS files too

4. **Performance**: What's the impact on page load?
   - **Benefit**: No server-side SCSS compilation = faster
   - **Cost**: Slightly larger CSS files (custom property declarations)
   - **Net**: Should be positive, especially for exports

5. **Backward Compatibility**: How long do we support SCSS themes?
   - **Recommendation**: 2 major versions with deprecation warnings

## Success Metrics

- ✅ Eliminate runtime SCSS compilation
- ✅ Reduce memory usage (no SCSSPHP parsing)
- ✅ Simplify theme development
- ✅ Maintain visual parity with current system
- ✅ Support all current theme customization options
- ✅ Improve export generation performance

## Resources

### Documentation
- [TESTING_PLAN.md](TESTING_PLAN.md) - Comprehensive testing strategy
- [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Moving layout logic to application
- [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Variable conversion patterns
- [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - Code examples

### External Resources
- Reference Implementation: https://github.com/greatislander/buckram-custom-props/
- CSS Custom Properties Spec: https://www.w3.org/TR/css-variables/
- PrinceXML CSS Support: https://www.princexml.com/doc/css-refs/
- Current Buckram Docs: https://buckram.pressbooks.org/

## Timeline (Rough Estimates)

- **Phase 1**: 2-3 weeks (POC + simple variables)
- **Phase 2**: 2-3 weeks (Core integration)
- **Phase 3**: 2-3 weeks (Export system)
- **Phase 4**: 4-6 weeks (Full migration + all themes)
- **Phase 5**: 1-2 weeks (Cleanup + docs)

**Total**: ~3-4 months for complete migration

## Next Steps

1. Review this plan with team
2. Try fetching the reference implementation to learn from it
3. Create spike/POC branch in Buckram
4. Migrate 10-20 simple variables as proof of concept
5. Test with McLuhan theme
6. Iterate and refine approach
