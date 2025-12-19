# Visual Regression Testing - Quick Start

## Setup Complete! ✅

You now have everything you need to capture baseline screenshots.

## Prerequisites

1. **Lando running** with Pressbooks instance
2. **Test book created** with sample content
3. **Playwright installed** ✅

## Step-by-Step Process

### Phase 1: Capture Baseline (SCSS Only)

**Before capturing baseline, ensure CSS custom properties are DISABLED:**

1. Check your mu-plugin is NOT loading CSS variables:
   ```bash
   # In your Lando site, check:
   # setup-development-environment/web/app/mu-plugins/buckram-css-props-test.php
   # Comment out or disable the wp_head action
   ```

2. Edit `capture-baseline.js` config:
   ```javascript
   const CONFIG = {
     baseUrl: 'https://pressbooks.test',  // Your Lando URL
     bookSlug: 'test-book',                // Your test book slug
     // ...
   };
   ```

3. Run baseline capture:
   ```bash
   npm run capture:baseline
   ```

   Screenshots saved to: `tests/screenshots/baseline/`

### Phase 2: Capture with CSS Variables

1. **Enable CSS custom properties** in your mu-plugin
   ```php
   // Ensure mu-plugins/buckram-css-props-test.php is active
   // and loading buckram-variables.css
   ```

2. Clear any caches in Lando:
   ```bash
   lando wp cache flush
   ```

3. Run comparison capture:
   ```bash
   npm run capture:comparison
   ```

   Screenshots saved to: `tests/screenshots/comparison/`

### Phase 3: Manual Comparison

Open both screenshot folders and compare side-by-side:

```
tests/screenshots/
  ├── baseline/
  │   ├── chapter-headings.png         (SCSS only)
  │   ├── chapter-body-typography.png  (SCSS only)
  │   └── ...
  └── comparison/
      ├── chapter-headings.png         (CSS custom properties)
      ├── chapter-body-typography.png  (CSS custom properties)
      └── ...
```

**What to look for:**
- ✅ **Should be identical** - No visible differences
- ❌ **Red flags** - Text reflow, spacing changes, color shifts
- ⚠️ **Minor diffs** - Anti-aliasing, browser rendering quirks (acceptable)

## Available Commands

```bash
# Capture baseline (SCSS only)
npm run capture:baseline

# Capture comparison (CSS variables)
npm run capture:comparison

# Capture individual components
npm run capture:components

# Open browser for DevTools inspection
npm run capture:devtools
```

## Troubleshooting

### "Cannot connect to https://pressbooks.test"

Check Lando is running:
```bash
cd path/to/setup-development-environment
lando start
lando info  # Get actual URL
```

Update `capture-baseline.js` with the correct URL.

### "Book not found"

Verify your book slug:
```bash
# Visit directly in browser:
https://pressbooks.test/your-book-slug/
```

### SSL Certificate Errors

Script already ignores SSL errors for local development. If issues persist, check Lando proxy configuration.

### No Screenshots Captured

1. Check console output for specific errors
2. Ensure book has content in the pages you're trying to capture
3. Verify URLs are correct (trailing slashes, etc.)

## Creating a Good Test Book

Your test book should include:

### 1. Sample Chapter (`/chapter/sample-chapter/`)

```html
<h1>Chapter Title (H1)</h1>
<p>Introduction paragraph with body text.</p>

<h2>Section Heading (H2)</h2>
<p>Body text for testing typography variables.</p>

<h3>Subsection (H3)</h3>

<blockquote>
  <p>Blockquote for testing quote styling.</p>
</blockquote>

<ul>
  <li>Unordered list item</li>
  <li>Another item</li>
</ul>

<ol>
  <li>Ordered list item</li>
  <li>Another item</li>
</ol>

<table>
  <thead>
    <tr><th>Header</th><th>Header</th></tr>
  </thead>
  <tbody>
    <tr><td>Cell</td><td>Cell</td></tr>
  </tbody>
</table>

<figure>
  <img src="..." alt="Test image">
  <figcaption>Image caption</figcaption>
</figure>
```

### 2. Front Matter (`/front-matter/introduction/`)

Basic front matter content.

### 3. Back Matter (`/back-matter/appendix/`)

Basic back matter content.

## Next Steps

After baseline comparison looks good:

1. **Set up automated Playwright tests** (see `TESTING_PLAN.md`)
2. **Add pixelmatch comparison** for automated diff detection
3. **Integrate into CI/CD** via GitHub Actions
4. **Continue variable conversion** with confidence

## Files Created

- ✅ `capture-baseline.js` - Screenshot capture script
- ✅ `VISUAL_TESTING_SETUP.md` - Detailed documentation
- ✅ `tests/screenshots/` - Screenshot directories
- ✅ `package.json` - Added npm scripts
- ✅ `.gitignore` - Ignore screenshot PNGs

## Resources

- **Full Testing Docs:** `TESTING_PLAN.md`
- **Component Test Page:** `TEST_COMPONENTS.html`
- **Progress Tracking:** `PHASE1_PROGRESS.md`
- **Playwright Docs:** https://playwright.dev/

---

**Ready to capture!** 📸

Edit the config in `capture-baseline.js`, then run:
```bash
npm run capture:baseline
```
