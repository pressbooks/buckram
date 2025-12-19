# Step 2 Progress: Update SCSS Files to Use CSS Variables

# Step 2 Progress: Update SCSS Files to Use CSS Variables

## ✅ Completed

### Phase 1: CSS Custom Properties Creation (100%)
✅ Created comprehensive CSS custom properties file (1,078 variables)
✅ File: `assets/styles/buckram-variables.css` (1,887 lines)

### Phase 2a: Format-Specific :root Declarations (100%)
✅ **Created:** `assets/styles/_css-variables.scss`

This SCSS file:
- Imports utility functions (`components/utilities`)
- Generates `:root` block with CSS custom properties
- Uses `if-map-get($variable, $type)` to resolve format-specific values (epub/prince/web)
- Compiles to different values based on `$type` variable

**Integration into Build:**
- Added `@import "../../../assets/styles/css-variables";` to all test SCSS files
- Imported AFTER SCSS variables are loaded (so `$type` and variables are available)
- Imported BEFORE components that use CSS custom properties

**Verification:**
- ✅ All test files compile successfully (`composer test` passes)
- ✅ Web format generates: `--body-font-size: 14pt`
- ✅ Prince format generates: `--body-font-size: 11pt`
- ✅ EPUB format generates: `--body-font-size: 11pt`
- ✅ Body component correctly uses `var(--body-font-family)`, `var(--body-font-size)`, etc. in all formats
- ✅ All three output formats (epub.css, prince.css, web.css) include :root declarations

### Phase 2b: First Component Conversion (100%)
✅ **File:** `components/elements/_body.scss`

## Approach

### Architecture Decision
The migration uses this pattern:
1. **CSS Variables File**: `buckram-variables.css` defines all 1,078 custom properties with defaults
2. **Component SCSS Files**: Updated to use `var(--property-name)` instead of `$scss-variable`
3. **Format-Specific Values**: Handled via `:root` declarations that override defaults based on output format

### Conversion Pattern
**Before (SCSS variables):**
```scss
body {
  font-family: $body-font-family;
  font-size: if-map-get($body-font-size, $type);
  line-height: if-map-get($body-line-height, $type);
}
```

**After (CSS custom properties):**
```scss
body {
  font-family: var(--body-font-family);
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
}
```

## Remaining Work

### Component Files to Update (Priority Order)

#### High Priority - Core Elements
- [ ] `components/elements/_headings.scss`
- [ ] `components/elements/_paragraphs.scss`
- [ ] `components/elements/_links.scss`
- [ ] `components/elements/_lists.scss`
- [ ] `components/elements/_tables.scss`
- [ ] `components/elements/_blockquotes.scss`
- [ ] `components/elements/_miscellaneous.scss`

#### Medium Priority - Structural Elements
- [ ] `components/_section-titles.scss`
- [ ] `components/_pages.scss`
- [ ] `components/_structure.scss`
- [ ] `components/_toc.scss`

#### Medium Priority - Special Elements
- [ ] `components/_specials.scss`
- [ ] `components/_media.scss`
- [ ] `components/_colors.scss`

#### Lower Priority - Subdirectories
- [ ] `components/section-titles/*.scss`
- [ ] `components/pages/*.scss`
- [ ] `components/structure/*.scss`
- [ ] `components/toc/*.scss`
- [ ] `components/specials/*.scss`
- [ ] `components/media/*.scss`

### Implementation Strategy

For each file:
1. **Read the file** to identify all SCSS variable usage
2. **Replace** `$variable-name` with `var(--variable-name)`
3. **Replace** `if-map-get($variable, $type)` with `var(--variable-name)`
4. **Test** compilation for each format (epub, prince, web)
5. **Verify** output CSS uses CSS custom properties correctly

### Format-Specific Handling

For variables that have format-specific values (maps in SCSS):
- Original: `$body-font-size: (epub: medium, prince: 11pt, web: 14pt)`
- Approach: Set format-specific values in `:root` during compilation
- Output: Same `var(--body-font-size)` in all formats, but different values in `:root`

## Testing Plan

After updating component files:
1. **Compile** all three formats (epub, prince, web)
2. **Verify** CSS custom properties are correctly used in output
3. **Visual regression test** to compare baseline vs. CSS variables output
4. **Test theme overrides** to ensure custom properties can be overridden
5. **Validate** print output (Prince) with complex books

## Benefits

Once complete, theme developers will be able to:
- Override any Buckram style by setting `--custom-property-name`
- Create dynamic themes without modifying SCSS
- Use browser dev tools to adjust styling in real-time
- Reduce compilation dependency for simple customizations

## Timeline

- Conversion of all component files: ~2-4 hours
- Testing and validation: ~1-2 hours
- Documentation updates: ~1 hour
- **Total estimated time:** 4-7 hours

## Next Steps

1. Continue converting component SCSS files (start with `_headings.scss`)
2. Create format-specific `:root` declarations
3. Update build process to include CSS variables
4. Test compilation and output
5. Update documentation

