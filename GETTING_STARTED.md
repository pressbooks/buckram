# Getting Started with CSS Custom Properties Migration

## ⚡ Quick Start Checklist

### Step 1: Review Documentation 
- [x] Read `README_CSS_CUSTOM_PROPERTIES.md` (you're here!)
- [ ] Review `CSS_CUSTOM_PROPERTIES_MIGRATION.md` for full strategy
- [ ] Check `CONVERSION_GUIDE.md` for conversion patterns
- [ ] Look at `poc/buckram-variables-simple.css` for examples
- [ ] Review `PHP_INTEGRATION_EXAMPLES.php` for backend integration

### Step 2: Understand Current System 
- [ ] Examine `assets/styles/variables/_colors.scss`
- [ ] Examine `assets/styles/variables/_elements.scss`
- [ ] Examine `assets/styles/components/elements/_headings.scss`
- [ ] Run `composer install && npm install` in Buckram
- [ ] Build current version: `npm run build`

### Step 3: Set Up POC Environment 
```bash
# In Buckram directory
cd buckram

# Create POC branch
git checkout -b poc/css-custom-properties

# Create working directory (already exists)
# mkdir -p poc

# Test current system
npm run build
npm test
```

### Step 4: Convert First Variable Set 

Pick one of these small sets to start:

#### Option A: Heading Text Transforms (5 variables)
```scss
// From variables/_elements.scss
$h1-text-transform: uppercase !default;
$h2-text-transform: none !default;
$h3-text-transform: none !default;
$h4-text-transform: none !default;
$h5-text-transform: none !default;
```

Convert to:
```css
/* In poc/headings-text-transform.css */
:root {
  --h1-text-transform: var(--custom-h1-text-transform, uppercase);
  --h2-text-transform: var(--custom-h2-text-transform, none);
  --h3-text-transform: var(--custom-h3-text-transform, none);
  --h4-text-transform: var(--custom-h4-text-transform, none);
  --h5-text-transform: var(--custom-h5-text-transform, none);
}
```

#### Option B: Heading Colors (6 variables)
```scss
// From variables/_colors.scss
$h1-color: $color-2 !default;
$h2-color: $color-2 !default;
$h3-color: $color-2 !default;
$h4-color: $color-3 !default;
$h5-color: $color-3 !default;
$h6-color: $color-3 !default;
```

#### Option C: Blockquote Properties (8 variables)
Simple variables for blockquote styling.

### Step 5: Create Test File 🧪

Create `poc/test-conversion.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>CSS Custom Properties Test</title>
    <link rel="stylesheet" href="headings-text-transform.css">
    <style>
        /* Test override */
        :root {
            --custom-h1-text-transform: lowercase;
        }
        
        /* Apply variables */
        h1 { text-transform: var(--h1-text-transform); }
        h2 { text-transform: var(--h2-text-transform); }
        h3 { text-transform: var(--h3-text-transform); }
    </style>
</head>
<body>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
</body>
</html>
```

### Step 6: Visual Test 
```bash
# Open test file in browser
# Windows:
start poc/test-conversion.html

# Verify:
# - H1 should be lowercase (override works)
# - H2 should be normal case (default works)
# - H3 should be normal case (default works)
```

### Step 7: Integration Test with Theme 

1. Copy POC CSS to test theme
2. Update theme to use custom properties
3. Test web rendering
4. Test PDF export (if possible at this stage)

### Step 8: Document Findings 

Create `poc/FINDINGS.md`:
```markdown
# POC Findings

## Date: [Today's Date]

## Variables Converted
- List variables converted

## Tests Performed
- [ ] Visual rendering test
- [ ] Override test
- [ ] Theme integration test

## Results
- What worked well?
- What was challenging?
- Any surprises?

## Recommendations
- Should we proceed with this approach?
- Any adjustments needed?
- Next set of variables to tackle?
```

## Success Criteria for POC

Before moving to full Phase 1 implementation:

- [ ] 5-10 variables successfully converted
- [ ] Variables work correctly in HTML test file
- [ ] Override mechanism works (`--custom-*` prefix)
- [ ] No browser compatibility issues
- [ ] Team consensus on approach
- [ ] Documentation pattern established

## Iteration Process

After initial POC:

1. **Review with team** - Show results, gather feedback
2. **Refine approach** - Adjust based on learnings
3. **Expand scope** - Convert next 10-20 variables
4. **Test in real theme** - Try with McLuhan (pressbooks-book)
5. **Document patterns** - Update guides with real examples

## Phase 1 Full Implementation Checklist

Once POC is approved:

### Colors (~30 variables)
- [ ] Base color palette (color-1 through color-6)
- [ ] Heading colors (h1-h6)
- [ ] Body color
- [ ] Link colors (simple ones)
- [ ] Blockquote color
- [ ] Table colors
- [ ] Special element colors

### Typography - Style Properties (~25 variables)
- [ ] Heading font-styles (h1-h6)
- [ ] Heading font-weights (h1-h6)
- [ ] Heading text-transforms (h1-h6)
- [ ] Heading text-aligns (h1-h6)
- [ ] Blockquote font-style/weight

### Typography - Spacing (~20 variables)
- [ ] Heading margins (top/bottom)
- [ ] Heading padding
- [ ] Paragraph margins
- [ ] Blockquote margins/padding
- [ ] List spacing

### Borders (~10 variables)
- [ ] Heading border styles
- [ ] Table border styles
- [ ] Separator styles

### Structure (~10 variables)
- [ ] Running content separators
- [ ] Simple position keywords

## Not in Phase 1

These wait until Phase 2:
- Variables with context maps (epub/prince/web)
- Font sizes (mostly context-dependent)
- Line heights (context-dependent)
- Complex calculations
- Functions and mixins

## Need Help?

### Common Issues

**Issue:** Override not working  
**Solution:** Check specificity. Ensure override is declared before use.

**Issue:** Value looks wrong  
**Solution:** Use browser dev tools to inspect computed values.

### Questions?

- Check existing documentation first
- Search for similar issues in CSS custom properties
- Ask team in appropriate channel
- Update documentation with answers

## Learning Resources

### CSS Custom Properties Basics
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Tricks: A Complete Guide to CSS Variables](https://css-tricks.com/a-complete-guide-to-custom-properties/)

### Advanced Topics
- [CSS Custom Properties cascade and inheritance](https://www.w3.org/TR/css-variables-1/#defining-variables)
- [PrinceXML CSS Variables Support](https://www.princexml.com/doc/css-variables/)

### Similar Projects
- [WordPress Gutenberg using CSS custom properties](https://github.com/WordPress/gutenberg/search?q=css+custom+properties)
- [Bootstrap 5 CSS variables](https://getbootstrap.com/docs/5.0/customize/css-variables/)

## Tips for Success

1. **Start Small** - Convert 5-10 variables first, not 100
2. **Test Often** - Check each conversion works before moving on
3. **Document Everything** - Write down patterns and learnings
4. **Visual Regression** - Take screenshots before/after
5. **Team Communication** - Share progress and blockers
6. **Be Patient** - This is a large migration, take it step by step