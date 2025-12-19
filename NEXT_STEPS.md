# Next Steps: CSS Migration Testing & Completion

## ✅ Phase 1 Complete: All Variables Migrated

**Status:** 🎉 **1,078 CSS custom properties created (100% complete)** 🎉

All SCSS variables have been converted to CSS custom properties in [buckram-variables.css](assets/styles/buckram-variables.css).

## ✅ Playwright Test Suite Complete

**Status:** 🎉 **Comprehensive visual regression test suite created** 🎉

See [PLAYWRIGHT_SUITE.md](PLAYWRIGHT_SUITE.md) for complete details.

## 📋 Immediate Next Steps

### 1. Initialize Test Environment
```bash
# Install new dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Generate HTML fixtures
npm run playwright:fixtures
```
- `$section-title-decoration-*` (7 variables)
- Subtitle/author spacing variables
### 2. Verify Fixture Generation
```bash
# Should create 7 HTML files in tests/visual-regression/fixtures/html/
ls tests/visual-regression/fixtures/html/

# Expected files:
# - complete-chapter.html
# - part-opener.html
# - front-matter.html
# - back-matter.html
# - typography-specimen.html
# - table-of-contents.html
# - prince-page.html
```

### 3. Build Baseline Version
```bash
# Build SCSS baseline (original variables)
composer build

# Verify output exists
ls assets/dist/styles/buckram.css
```

### 4. Build CSS Variables Version
```bash
# Build version with CSS custom properties
npm run build

# Or manually compile if needed
```

### 5. Run Initial Tests
```bash
# Run in UI mode (recommended for first run)
npm run playwright:test:ui

# Or run headless
npm run playwright:test
```

### 6. Review Test Results
- Check console output for pass/fail
- Review screenshots in `screenshots/` directory
- Check diffs in `test-results/` if tests fail
- View HTML report: `npm run playwright:report`

### 7. Continue SCSS Conversions

Convert remaining component files (~29 files) from `$variable` to `var(--property)`:

**Priority order:**
1. `_headings.scss` - Core typography
2. `_paragraphs.scss` - Text blocks
3. `_colors.scss` - Color applications
4. `_tables.scss` - Table styling
5. `_lists.scss` - List styling
6. ... (see [STEP2_PROGRESS.md](STEP2_PROGRESS.md) for full list)

**Process for each file:**
```bash
# 1. Convert SCSS file
# Replace: $variable with var(--property)
# Replace: if-map-get() with var(--property)

# 2. Test the conversion
npm run playwright:test:ui

# 3. Review any visual differences

# 4. Update STEP2_PROGRESS.md

# 5. Commit changes
git add .
git commit -m "feat: convert [filename] to CSS variables"
```

## 🎯 Immediate Next Command

```bash
# Start by generating fixtures and running tests
npm install && npm run playwright:install && npm run playwright:fixtures
```

Then:
```bash
# Run tests in UI mode to see current state
npm run playwright:test:ui
```

## 📚 Reference Documentation

- [TESTING.md](TESTING.md) - Comprehensive testing guide
- [PLAYWRIGHT_SUITE.md](PLAYWRIGHT_SUITE.md) - Test suite overview
- [tests/visual-regression/README.md](tests/visual-regression/README.md) - Detailed test docs
- [STEP2_PROGRESS.md](STEP2_PROGRESS.md) - SCSS conversion tracker
- [PHASE1_PROGRESS.md](PHASE1_PROGRESS.md) - CSS variables completed ✅

## 🎉 What Success Looks Like

When migration is complete:
- ✅ All 1,078 CSS custom properties defined
- ✅ All ~30 SCSS component files converted
- ✅ All Playwright tests passing
- ✅ Visual output identical to baseline
- ✅ Theme overrides working correctly
- ✅ CI/CD passing on all branches
- ✅ Documentation complete
- ✅ Ready for production release

---

## 📝 Old Content (Reference)

The sections below are from the previous iteration and kept for reference:

### Remaining Convertible Variables (Historical)

Variables for:
- Screen reader text
- Focus styles
- Skip links

**Impact:** Important for web, but limited variables

### Lower Priority (Format-Specific)

#### 6. EPUB-Specific
Files with heavy EPUB context:
- `_epub.scss` - EPUB-only variables
- `_mobi.scss` - Mobi-only variables

**Impact:** Not relevant for web POC

#### 7. Prince-Specific  
Files with heavy Prince context:
- Prince page setup
- Running headers/footers
- PDF-specific formatting

**Impact:** Not relevant for web POC

## Recommended Next Phase: Phase 4

**Target:** Section Titles + TOC variables (60-70 variables)  
**New Total:** ~310 variables (344% of original target)

### Variables to Add (Phase 4)

#### Section Titles (40 variables)
```css
/* Display & Layout */
--section-title-display
--section-title-margin-top (web default)
--section-title-margin-bottom (web default)
--section-title-margin-left (web default)
--section-title-margin-right (web default)

/* Borders & Spacing */
--section-title-border-bottom-width (web: 0)
--section-title-border-bottom-style
--section-title-border-bottom-color
--section-title-padding-bottom (web: 0)

/* Typography */
--section-title-font-family
--section-title-font-size (web default)
--section-title-font-style
--section-title-font-weight
--section-title-align
--section-title-text-transform
--section-title-line-height
--section-title-letter-spacing (web default)
--section-title-word-spacing (web default)

/* Subtitle & Author */
--section-title-subtitle-spacing
--section-title-author-spacing

/* Decorative Elements */
--section-title-decoration-font-family
--section-title-decoration-content
--section-title-decoration-display
--section-title-decoration-font-size (web: 0)
--section-title-decoration-font-weight
--section-title-decoration-margin-bottom (web: 0)
--section-title-decoration-margin-top (web: 0)

/* Title Block Margins */
--section-title-block-margin-top (web default)
--section-title-block-margin-bottom (web default)
--section-title-block-margin-left (web default)
--section-title-block-margin-right (web default)
```

#### TOC Variables (30 variables)
```css
/* Display & Layout */
--toc-display
--toc-left-margin-left
--toc-subsection-margin-top
--toc-sub-width
--toc-title-width

/* Chapter Number */
--toc-left-chapter-number-margin-right
--toc-left-chapter-number-width
--toc-left-page-number-top

/* Block Spacing */
--toc-block-margin-top
--toc-part-margin-top
--toc-front-matter-margin-top (web default)
--toc-chapter-margin-top (web default)
--toc-back-matter-margin-top (web default)

/* Width Controls */
--toc-left-title-width (web default)
--toc-center-title-width (web default)
--toc-left-subtitle-width (web default)
--toc-center-subtitle-width
--toc-left-author-width (web default)
--toc-center-author-width

/* Gutters (EPUB/Prince mainly, document for web) */
--toc-left-left-gutter (web: 0 or omit)
--toc-left-right-gutter (web: 0 or omit)
```

## Testing Plan for Phase 4

After adding section title & TOC variables:

### 1. Expand mu-plugin Test
Update `buckram-css-props-test.php` to test:
- Section title styling in chapters
- TOC display on book home page
- Override examples for titles

### 2. Create Component CSS Files
Convert these components:
- `components/section-titles.css`
- `components/toc.css`

### 3. Live Testing
Test in Pressbooks:
- Chapter title rendering
- Part titles
- TOC navigation
- Override mechanism for section titles

### 4. Documentation
Update:
- PHASE1_PROGRESS.md with Phase 4 details
- README_CSS_CUSTOM_PROPERTIES.md with new variable count
- TESTING_GUIDE.md with section title tests

## Long-Term Roadmap

### Immediate (Next 1-2 hours)
- [ ] Add Phase 4 variables (section titles + TOC)
- [ ] Create section-titles.css component
- [ ] Test in live Pressbooks

### Short-Term (Next session)
- [ ] Convert remaining web-relevant variables
- [ ] Reach 300+ variables
- [ ] Expand test coverage to all components
- [ ] Document all test results

### Medium-Term  
- [ ] Build process integration (webpack.mix.js)
- [ ] McLuhan theme integration
- [ ] Create pull request for review

### Long-Term
- [ ] EPUB-specific CSS variables file
- [ ] Prince-specific CSS variables file
- [ ] Format detection and loading
- [ ] Theme developer migration guide
- [ ] Video walkthrough for community

## Questions to Consider

1. **Should we convert ALL variables or focus on web-only?**
   - Current approach: Focus on web, document others
   - Alternative: Convert everything, create format-specific files

2. **When to integrate into build process?**
   - Current: Keep separate until thoroughly tested
   - Alternative: Integrate early for real-world testing

3. **How to handle EPUB/Prince contexts?**
   - Current: Use web defaults, document other formats
   - Alternative: Create three CSS files (base.css, epub.css, prince.css)

4. **Testing completeness threshold?**
   - Current: Test each component visually
   - Alternative: Automated screenshot comparison tests

## Decision Point

**Recommendation:** Proceed with Phase 4 (section titles + TOC), then pause for comprehensive testing before adding more variables.

**Reasoning:**
- 300+ variables is substantial coverage
- Better to test thoroughly than convert everything rapidly
- Section titles are highly visible and valuable to test
- TOC adds navigation testing
- Good stopping point before build integration

**Alternative:** If you prefer, we can continue aggressive variable conversion and test everything at once later.

What's your preference?
