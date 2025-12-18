# Buckram CSS Custom Properties Migration

## 📋 Summary

This directory contains documentation and proof-of-concept code for migrating Buckram from SCSS variables to CSS custom properties. This migration aims to eliminate runtime SCSS compilation dependencies and simplify the theme customization architecture.

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

## 🚀 Quick Start

### Understanding the Migration

The migration follows this pattern:

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

### Phase 1: Simple Variables ⭐ START HERE
**Status:** Ready to implement  
**Target:** Variables with single, non-context-dependent values

- Colors (most)
- Font styles, weights, transforms
- Margins, padding, borders (simple ones)
- Running content separators

**Example file:** `poc/buckram-variables-simple.css`

### Phase 2: Context-Based Variables
**Status:** Strategy defined, awaiting Phase 1 completion  
**Target:** Variables with different values for web/epub/prince contexts

Current pattern:
```scss
$body-font-size: (epub: medium, prince: 11pt, web: 14pt) !default;
```

New approach: Generate separate CSS files per context with context-specific defaults.

### Phase 3: Theme Options Integration
**Status:** Examples provided in PHP_INTEGRATION_EXAMPLES.php  
**Target:** PHP code that generates SCSS variables from WordPress options

Replace:
```php
$styles->getSass()->setVariables(['h1-font-weight' => 'bold']);
```

With:
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
