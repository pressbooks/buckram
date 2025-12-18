# Buckram CSS Custom Properties Migration

## ✅ Phase 1 Complete! (December 18, 2024)

**Status:** 107 variables converted (119% of 90 target)  
**Branch:** `feat/migrate-to-css-properties`  
**Validated:** Live Pressbooks environment testing successful

### What's Been Completed

Phase 1 focused on converting **simple SCSS variables** (no context maps) to CSS custom properties:

**Variables Converted (107 total):**
- **Colors (13):** heading, body, blockquote, table, caption colors
- **Typography (40):** text transforms, font styles, weights, alignment for h1-h6, body, blockquote
- **Borders (21):** heading border styles, widths, colors
- **Layout (27):** blockquote margins/padding, table spacing, cell padding
- **Elements (6):** cite, sub/sup, dt/dd, code styling

**Files Created:**
- `assets/styles/buckram-variables.css` - 107 CSS custom properties with override pattern
- `assets/styles/components/headings.css` - Converted headings component
- `assets/styles/test.html` - Standalone browser test page
- `buckram-css-props-test.php` - mu-plugin test harness for live Pressbooks validation
- `PHASE1_PROGRESS.md` - Detailed progress tracking and testing results

**Testing & Validation:**
- ✅ Tested in live Pressbooks environment (Lando)
- ✅ CSS custom properties visible in browser DevTools
- ✅ Override mechanism validated with theme customization
- ✅ Hybrid approach proven: SCSS compilation + CSS vars coexist
- ✅ Documented specificity requirements for theme integration

### Override Pattern

All variables use a two-tier pattern allowing theme customization:

```css
:root {
  /* Base variable with theme override hook */
  --h1-color: var(--custom-h1-color, #b01109);
  --h1-text-transform: var(--custom-h1-text-transform, uppercase);
}

/* Themes can override by setting --custom-* variables */
:root {
  --custom-h1-color: #0066cc;
  --custom-h1-text-transform: none;
}
```

## 📋 Summary

This directory contains documentation and implementation for migrating Buckram from SCSS variables to CSS custom properties. Phase 1 eliminates runtime SCSS compilation for 107 simple variables while maintaining full backward compatibility.

## 📁 Files in This Migration

### Documentation
- **`CSS_CUSTOM_PROPERTIES_MIGRATION.md`** - Comprehensive migration plan with phases, strategy, and technical details
- **`CONVERSION_GUIDE.md`** - Quick reference for converting SCSS variables to CSS custom properties
- **`POC_SIMPLE_VARIABLES.md`** - Proof of concept documentation focusing on simple variable migration

### Code Examples
- **`poc/buckram-variables-simple.css`** - Working example of converted variables showing the new pattern
- **`PHP_INTEGRATION_EXAMPLES.php`** - PHP code examples for integration into Pressbooks core

## 🎯 Goals

1. **Eliminate SCSSPHP dependency** - Remove runtime SCSS compilation
2. **Simplify architecture** - Use standard CSS custom properties instead of proprietary SCSS
3. **Improve performance** - Pre-compile CSS, no server-side processing needed
4. **Maintain compatibility** - Support existing themes during transition
5. **Enhance developer experience** - Clearer override mechanism, better debugging

## 🚀 Using Phase 1 CSS Custom Properties

### For Theme Developers

To use the new CSS custom properties in your theme:

1. **Switch to the `feat/migrate-to-css-properties` branch:**
   ```bash
   cd packages/buckram
   git checkout feat/migrate-to-css-properties
   ```

2. **Include the CSS custom properties file:**
   ```php
   wp_enqueue_style(
       'buckram-variables',
       get_template_directory_uri() . '/packages/buckram/assets/styles/buckram-variables.css',
       [],
       '1.0.0'
   );
   ```

3. **Override variables in your theme CSS:**
   ```css
   :root {
     /* Customize heading colors */
     --custom-h1-color: #0066cc;
     --custom-h2-color: #004080;
     
     /* Customize typography */
     --custom-h1-text-transform: none;
     --custom-body-font-weight: 400;
     
     /* Customize spacing */
     --custom-blockquote-padding-left: 3em;
     --custom-table-border-width: 2px;
   }
   ```

### For Testing

A test harness is included for live Pressbooks validation:

1. Copy `buckram-css-props-test.php` to `wp-content/mu-plugins/`
2. Edit the file to set your test values
3. View any book chapter to see CSS custom properties applied
4. Inspect in DevTools to verify values under `:root`

### Available Variables

See `PHASE1_PROGRESS.md` for the complete list of 107 converted variables, organized by category:
- Colors (headings, body, blockquote, tables)
- Typography (font styles, weights, transforms)
- Layout (margins, padding, borders)
- Element styling (cite, code, tables, lists)

## 🎓 Understanding the Migration Pattern

### The Two-Tier Override System

**Before (SCSS):**
```scss
$h1-font-weight: normal !default;

h1 {
  font-weight: $h1-font-weight;
}
```

**After (CSS Custom Properties):**
```css
:root {
  --h1-font-weight: var(--custom-h1-font-weight, normal);
}

h1 {
  font-weight: var(--h1-font-weight);
}
```

**Theme Override:**
```css
:root {
  --custom-h1-font-weight: bold;
}
```

### Key Benefits

- ✅ No runtime compilation needed
- ✅ Standard CSS syntax
- ✅ Browser dev tools can inspect computed values
- ✅ Better performance for exports (PDF/EPUB)
- ✅ Clearer override mechanism with `--custom-*` prefix

## 📖 Migration Phases

### Phase 1: Simple Variables ✅ COMPLETE
**Status:** Complete (107/90 variables - 119% of target)  
**Branch:** `feat/migrate-to-css-properties`  
**Completed:** December 18, 2024

Converted all simple variables (no context maps) including:
- All heading colors, styles, weights, transforms, alignment, borders
- Body and blockquote colors, styles, weights
- Table styling (margins, padding, fonts, borders)
- Caption, cite, code element styling
- Definition list (dt/dd) styling
- Sub/sup element styling

**Files:** See `assets/styles/buckram-variables.css` and `PHASE1_PROGRESS.md`

### Phase 2: Context-Based Variables 📍 NEXT
**Status:** Planning in progress  
**Target:** Variables with different values for web/epub/prince contexts

Current SCSS pattern:
```scss
$body-font-size: (epub: medium, prince: 11pt, web: 14pt) !default;
$blockquote-padding-top: (epub: 0, prince: 0, web: 0) !default;
```

Strategy options:
1. Generate separate CSS files per context (web.css, epub.css, prince.css)
2. Use CSS `@media` queries or custom properties with JavaScript context detection
3. Server-side rendering with context-specific variables

Decision pending based on build process integration requirements.

### Phase 3: Component Conversion
**Status:** Waiting for Phase 2  
**Target:** Convert remaining SCSS components to use CSS custom properties

Components to convert:
- Body component (`components/elements/_body.scss`)
- Blockquote component (`components/elements/_blockquotes.scss`)
- Table component (`components/elements/_tables.scss`)
- List components (`components/elements/_lists.scss`)

### Phase 4: Theme Options Integration
**Status:** Strategy defined  
**Target:** PHP code that generates CSS custom properties from WordPress options

Replace SCSS variable injection:
```php
$styles->getSass()->setVariables(['h1-font-weight' => 'bold']);
```

With CSS custom property generation:
```php
$css = $styles->optionsToCssProperties(['h1_font_weight' => 'bold']);
```

### Phase 4: Export System
**Status:** Strategy defined  
**Target:** PDF and EPUB export routines

Replace runtime SCSS compilation with:
1. Load pre-compiled CSS
2. Inject custom property overrides
3. Concatenate

### Phase 5: Theme Updates
**Status:** Pattern documented  
**Target:** All child themes (pressbooks-book and children)

Update theme import pattern from SCSS to CSS custom properties.

## 🛠️ Implementation Roadmap

### Immediate Next Steps

1. **Review & Approve** - Team reviews this migration plan
2. **Create Branch** - Start `feat/css-custom-properties` branch in Buckram
3. **Phase 1 POC** - Implement 20-30 simple variables
4. **Test with McLuhan** - Verify rendering in web/PDF/EPUB
5. **Iterate** - Refine based on learnings
6. **Expand** - Complete Phase 1 for all simple variables

### Timeline Estimates

- **Phase 1:** 2-3 weeks
- **Phase 2:** 2-3 weeks  
- **Phase 3:** 2-3 weeks
- **Phase 4:** 2-3 weeks
- **Phase 5:** 4-6 weeks
- **Total:** ~3-4 months

## 🧪 Testing Strategy

### For Each Variable Conversion

- [ ] Visual regression test (before/after screenshots)
- [ ] Web rendering test
- [ ] PDF export test (PrinceXML)
- [ ] EPUB export test
- [ ] Theme override test
- [ ] PHP theme options test

### Test Matrix

| Format | Browser/Tool | Test Status |
|--------|-------------|-------------|
| Web | Chrome | ⏳ Pending |
| Web | Firefox | ⏳ Pending |
| Web | Safari | ⏳ Pending |
| PDF | PrinceXML | ⏳ Pending |
| EPUB | Apple Books | ⏳ Pending |
| EPUB | Calibre | ⏳ Pending |

## 📚 Technical Reference

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Base variable | `--variable-name` | `--h1-font-weight` |
| Override point | `--custom-variable-name` | `--custom-h1-font-weight` |
| Context-specific | `--variable-name-context` | `--body-font-size-epub` |

### File Structure

```
buckram/
├── assets/styles/
│   ├── variables/           # Original SCSS (source of truth during migration)
│   └── components/          # Component styles
├── dist/                    # Build output
│   ├── buckram-web.css
│   ├── buckram-epub.css
│   ├── buckram-prince.css
│   └── buckram-common.css
├── poc/                     # Proof of concept
│   └── buckram-variables-simple.css
└── [MIGRATION DOCS]         # This directory
```

### PHP Integration Points

**Core Classes to Update:**
- `inc/class-styles.php` - Add `optionsToCssProperties()` method
- `inc/class-sass.php` - May deprecate or keep for compatibility
- `inc/modules/export/prince/class-pdf.php` - Update export routine
- `inc/modules/export/epub/*.php` - Update EPUB exports
- `inc/modules/themeoptions/*.php` - Update option handlers

## 🤔 Open Questions & Decisions

### 1. SCSSPHP Removal
**Q:** Remove completely or keep for backward compatibility?  
**A:** Keep for 2 major versions with deprecation notices

### 2. Build vs Runtime
**Q:** How much processing at build time vs runtime?  
**A:** Maximize build-time, minimize runtime

### 3. Backward Compatibility Window
**Q:** How long support SCSS themes?  
**A:** 2 major versions recommended

### 4. Context Handling
**Q:** How to handle epub/prince/web differences?  
**A:** Separate CSS files per context + inline overrides for theme options

## 📝 Variables Inventory

### ✅ Ready to Convert (Phase 1)

#### Colors (~30 variables)
- Heading colors (h1-h6)
- Body color
- Blockquote color
- Table colors
- Special element colors

#### Typography (~50 variables)
- Font styles (normal, italic)
- Font weights (normal, bold)
- Text transforms (uppercase, lowercase, none)
- Text alignment (left, center, right)
- Simple margins/padding

#### Structure (~10 variables)
- Running content separators
- Simple position keywords
- Border styles

**Total Phase 1:** ~90 variables

### ⏸️ Requires Phase 2 (~80 variables)

- Variables with context maps (epub/prince/web)
- Font sizes (mostly context-dependent)
- Line heights (context-dependent)
- Some link colors

### 🔧 Requires Phase 3 (~20 variables)

- Complex position calculations
- Running content interpolation
- Font detection logic

## 🆘 Getting Help

### Resources

- **Buckram Docs:** https://buckram.pressbooks.org/
- **CSS Custom Properties Spec:** https://www.w3.org/TR/css-variables/
- **PrinceXML CSS Support:** https://www.princexml.com/doc/css-refs/
- **MDN CSS Variables:** https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

### Contact

- Open GitHub issues for bugs/questions
- Discuss in team channels for architecture decisions
- Update this documentation as we learn

## ✅ Success Criteria

Migration is successful when:

- [ ] All current theme options work with CSS custom properties
- [ ] All export formats render identically to SCSS version
- [ ] No runtime SCSS compilation needed
- [ ] Theme override mechanism is clear and documented
- [ ] Performance is equal or better than SCSS version
- [ ] All child themes updated and working
- [ ] Migration guide published for third-party developers

## 🎓 Learning from This Project

Key takeaways:
1. SCSS `!default` maps well to CSS custom properties with fallbacks
2. Context-based values require build-time separation
3. PHP integration is straightforward with custom property injection
4. Testing across formats is critical (web, PDF, EPUB)
5. Gradual migration is possible with compatibility layer

---

**Last Updated:** December 18, 2024  
**Status:** Planning Phase  
**Next Milestone:** Phase 1 POC Implementation
