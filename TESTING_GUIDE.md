# Testing CSS Custom Properties in Pressbooks

This guide explains how to test Buckram's CSS custom properties in a live Pressbooks webbook.

## Overview

We've converted 242 SCSS variables to CSS custom properties across 9 major component areas:
- Headings (62 variables)
- Body Typography (4 variables)
- Blockquotes (14 variables)
- Paragraphs (18 variables)
- Lists (20 variables)
- Tables (14 variables)
- Code & Miscellaneous (8 variables)
- Image Captions (14 variables)
- Special Elements: Pullquotes, Sidebars, Textboxes (64 variables)

**Total: 242 variables (269% of original 90 target)**

## Quick Test Setup

### Method 1: Must-Use Plugin (Recommended)

Create `web/app/mu-plugins/buckram-css-props-test.php`:

```php
<?php
/**
 * Plugin Name: Buckram CSS Custom Properties Test
 * Description: Loads Buckram CSS custom properties for testing
 * Version: 1.0.0
 */

add_action('wp_head', function() {
    // Only load on book pages
    if (!is_front_page() && !is_home()) {
        ?>
        <style id="buckram-css-props">
        <?php
        $css_file = __DIR__ . '/../themes/pressbooks-book/packages/buckram/assets/styles/buckram-variables.css';
        if (file_exists($css_file)) {
            echo file_get_contents($css_file);
        }
        ?>
        </style>
        <?php
    }
}, 999);
```

### Method 2: Theme Customizer CSS

1. Go to **Appearance → Customize → Additional CSS**
2. Copy contents of `buckram-variables.css`
3. Paste into Custom CSS field
4. Click **Publish**

## Test Components

### Using TEST_COMPONENTS.html

The `TEST_COMPONENTS.html` file contains comprehensive tests for all components:

1. **Open in browser** to see the expected test structure
2. **Copy sections** you want to test into Pressbooks chapter content
3. **View the webbook** to verify CSS variables are working

### Quick Visual Tests

#### Test 1: Heading Colors
Add this to a chapter:
```html
<h1>Chapter Title</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
```

**Verify in DevTools:**
- Inspect H1, should see `color: var(--h1-color)`
- Check `:root` styles, should see `--h1-color: var(--custom-h1-color, #373d3f)`

#### Test 2: Body Typography
Just view any chapter with regular paragraphs.

**Verify in DevTools:**
- Body should use `font-size: var(--body-font-size)`
- Line height should use `line-height: var(--body-line-height)`

#### Test 3: Blockquotes
Add this to a chapter:
```html
<blockquote>
  <p>This is a test blockquote.</p>
  <cite>— Test Author</cite>
</blockquote>
```

**Verify:**
- Left border should be visible
- Padding controlled by `--blockquote-padding-left`
- Cite element styled with `--blockquote-cite-font-size`

#### Test 4: Tables
Add a table through WordPress editor.

**Verify:**
- Border width: `--table-border-width`
- Cell borders: `--table-cell-border-*-width`
- Try `.no-border` and `.grid` classes

#### Test 5: Lists
Add ordered and unordered lists.

**Verify:**
- Margins: `--ol-margin-top`, `--ul-margin-top`
- Indentation: `--ol-margin-left`, `--ol-padding-left`

#### Test 6: Images
Add image with caption.

**Verify:**
- Caption font size: `--image-caption-font-size`
- Caption margin: `--image-caption-margin-top`
- Image wrapper spacing: `--image-wrapper-margin-*`

## Testing Overrides

### Example: Change H1 Color to Red

Add to Custom CSS or mu-plugin:

```css
:root {
  --custom-h1-color: #b01109;
  --custom-h1-text-transform: uppercase;
}
```

**Result:** All H1 headings should turn red and uppercase.

### Example: Larger Body Text

```css
:root {
  --custom-body-font-size: 18pt;
  --custom-body-line-height: 1.8;
}
```

**Result:** Body text increases to 18pt with more line spacing.

### Example: Thicker Table Borders

```css
:root {
  --custom-table-border-width: 3px;
  --custom-table-border-color: #3b82f6;
}
```

**Result:** Tables get 3px blue borders.

## Browser DevTools Inspection

### View All Variables
1. **Open DevTools** (F12)
2. **Select Elements tab**
3. **Click `<html>` element**
4. **Look for `:root` styles**
5. **Expand to see all 242 variables**

### Check Variable Application
1. **Inspect any element** (H1, paragraph, table, etc.)
2. **Look at Computed styles**
3. **Should see** `var(--variable-name)` instead of hardcoded values
4. **Click the variable** to jump to its definition

### Verify Overrides Work
1. **Add custom override** to `:root`
2. **Inspect element** that uses that variable
3. **Should see** fallback chain: `var(--custom-h1-color, #373d3f)`
4. **Verify** computed value uses your override

## Testing Checklist

Use this checklist to validate all components:

### Headings ✅
- [ ] H1-H6 display with variable colors
- [ ] Text transform works (try uppercase override)
- [ ] Font weight controlled by variables
- [ ] Bottom borders display correctly
- [ ] Alignment controlled by `--h*-align`

### Body Text ✅
- [ ] Font size from `--body-font-size`
- [ ] Line height from `--body-line-height`
- [ ] Color from `--body-color`
- [ ] Font style and weight variables work

### Blockquotes ✅
- [ ] Border visible with correct width/color
- [ ] Padding controlled by variables
- [ ] Font style (typically italic)
- [ ] Cite element styled separately
- [ ] Pull quotes display centered

### Paragraphs ✅
- [ ] Indentation from `--para-indent`
- [ ] `.no-indent` class works
- [ ] `.hanging-indent` class works
- [ ] Letter/word spacing variables
- [ ] Hyphens setting (web only)

### Lists ✅
- [ ] Ordered lists: proper margins/padding
- [ ] Unordered lists: proper margins/padding
- [ ] Nested lists indented correctly
- [ ] Definition lists: dt/dd spacing
- [ ] List item vertical spacing

### Tables ✅
- [ ] Default: horizontal lines only
- [ ] `.no-border`: no borders
- [ ] `.grid`: full grid borders
- [ ] `.lines`: same as default
- [ ] Cell padding and spacing
- [ ] Alignment classes work

### Code & Miscellaneous ✅
- [ ] Inline code: background color
- [ ] Cite: font size and style
- [ ] Subscript: position and size
- [ ] Superscript: position and size

### Images ✅
- [ ] Caption typography distinct
- [ ] Caption spacing (margin-top, padding-bottom)
- [ ] Image wrapper margins
- [ ] Align left: proper right margin
- [ ] Align right: proper left margin

### Special Elements ✅
- [ ] Pullquotes: centered, bold, larger
- [ ] Pullquote left: floats left, 45% width
- [ ] Pullquote right: floats right, 45% width
- [ ] Sidebars: smaller, italic text
- [ ] Textboxes: distinct background/border

### Override Mechanism ✅
- [ ] `--custom-*` prefix overrides defaults
- [ ] Multiple overrides work together
- [ ] Changes apply immediately
- [ ] No breaking of existing styles

## Common Issues & Solutions

### Issue: Variables not loading
**Solution:** Check file path in mu-plugin is correct. Use absolute path to buckram-variables.css.

### Issue: Styles not applying
**Solution:** Increase specificity or add `!important` to variable declarations:
```css
section.chapter h1.entry-title {
  color: var(--h1-color) !important;
}
```

### Issue: Overrides not working
**Solution:** Make sure you're using `--custom-*` prefix, not just `--h1-color`.

### Issue: Some elements missing variables
**Solution:** Check if component CSS file exists and is being loaded. Some components haven't been converted yet.

## Next Steps

After validating these tests:

1. ✅ **Document results** - Take screenshots, note any issues
2. ✅ **Create component CSS files** - Convert remaining SCSS components
3. ✅ **Integration** - Merge into pressbooks-book theme build process
4. ✅ **EPUB/Prince support** - Create format-specific variable files
5. ✅ **Community docs** - Write migration guide for theme developers

## Test Results Template

Use this template to document test results:

```markdown
## Test Results - [Date]

**Tester:** [Your Name]
**Environment:** Lando/Pressbooks [version]
**Browser:** [Browser & version]
**Book:** [Book name/URL]

### Components Tested

#### Headings
- Status: ✅ Pass / ❌ Fail
- Notes: 

#### Body Typography  
- Status: ✅ Pass / ❌ Fail
- Notes:

#### Blockquotes
- Status: ✅ Pass / ❌ Fail
- Notes:

[... continue for all components ...]

### Issues Found
1. 
2. 

### Screenshots
- [Attach screenshots showing variables in DevTools]
- [Attach screenshots of rendered components]
```

## Resources

- **Component Test Page:** `TEST_COMPONENTS.html`
- **Variable List:** `buckram-variables.css` (242 variables)
- **Progress Tracking:** `PHASE1_PROGRESS.md`
- **Migration Docs:** `README_CSS_CUSTOM_PROPERTIES.md`
