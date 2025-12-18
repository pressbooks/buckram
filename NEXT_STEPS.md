# Next Steps: Additional Variables & Testing

## Current Status

✅ **Phase 1 Complete:** 107 simple variables (119% of 90 target)  
✅ **Phase 2 Complete:** 61 context-aware variables  
✅ **Phase 3 Complete:** 74 special elements variables  
✅ **Component Conversion:** 8 component CSS files  
✅ **Testing Resources:** TEST_COMPONENTS.html + TESTING_GUIDE.md

**Total Converted:** 242 variables (269% of original target)

## Remaining Convertible Variables

Based on scan of variables/ directory, these files contain additional simple variables that can be converted:

### High Priority (Web-Focused)

#### 1. Section Titles (~30-40 variables)
File: `variables/_section-titles.scss`

Simple variables:
- `$section-title-display`
- `$section-title-border-bottom-style`
- `$section-title-border-bottom-color`
- `$section-title-font-family`
- `$section-title-font-style`
- `$section-title-font-weight`
- `$section-title-align`
- `$section-title-text-transform`
- `$section-title-decoration-*` (7 variables)
- Subtitle/author spacing variables

Context-mapped (use web defaults):
- `$section-title-margin-*` (top, bottom, left, right)
- `$section-title-block-margin-*`
- `$section-title-font-size`
- `$section-title-letter-spacing`
- `$section-title-word-spacing`

**Impact:** Controls chapter/section title appearance in webbooks

#### 2. TOC (Table of Contents) (~25-30 variables)
File: `variables/_toc.scss`

Simple variables:
- `$toc-display`
- `$toc-left-margin-left`
- `$toc-subsection-margin-top`
- `$toc-block-margin-top`
- `$toc-*-width` variables

Context-mapped:
- `$toc-*-margin-top` for different section types
- `$toc-left-*-width` variables

**Impact:** Web TOC display (mostly EPUB/Prince focused, but some web use)

#### 3. Running Content (~15-20 variables)
File: `variables/_pages.scss`

Context-mapped (Prince-specific but documentable):
- `$running-content-*` variables for headers/footers
- Page margin variables

**Impact:** Print/PDF only (low priority for web POC)

### Medium Priority

#### 4. Structure (~10-15 variables)
File: `variables/_structure.scss`

Variables for:
- Page breaks
- Column spans
- Widows/orphans (already have some)
- Display properties

**Impact:** Layout control, some web-relevant

#### 5. Accessibility (~5-10 variables)
File: `variables/_accessibility.scss`

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
