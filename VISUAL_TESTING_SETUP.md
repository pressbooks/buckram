# Visual Regression Testing Setup

## Quick Start: Capture Baseline Screenshots

### 1. Install Playwright

```bash
npm install -D @playwright/test playwright
```

### 2. Configure Your Test Book

Edit `capture-baseline.js`:

```javascript
const CONFIG = {
  baseUrl: 'https://pressbooks.test',
  bookSlug: 'your-test-book', // Change this!
  // ... rest of config
};
```

### 3. Capture Baseline (SCSS Only)

Make sure CSS custom properties are **NOT** active in your mu-plugin:

```bash
# Capture baseline screenshots with SCSS only
node capture-baseline.js
```

Screenshots saved to: `tests/screenshots/baseline/`

### 4. Activate CSS Variables

In your mu-plugin, ensure CSS custom properties are loaded:

```php
// mu-plugins/buckram-css-props-test.php should be active
```

### 5. Capture Comparison (CSS Variables)

```bash
# Capture comparison screenshots with CSS custom properties
node capture-baseline.js comparison
```

Screenshots saved to: `tests/screenshots/comparison/`

### 6. Manual Comparison

Compare screenshots side-by-side:

- `tests/screenshots/baseline/chapter-headings.png`
- `tests/screenshots/comparison/chapter-headings.png`

Look for any visual differences.

## Capture Modes

### Full Page Screenshots (Default)

```bash
node capture-baseline.js
```

Captures full page screenshots of configured pages.

### Component Screenshots

```bash
node capture-baseline.js components
```

Captures individual component screenshots (H1, H2, paragraphs, etc.).

### DevTools Inspection

```bash
node capture-baseline.js devtools
```

Opens browser with chapter loaded for manual DevTools inspection of CSS variables.

## Screenshot Organization

```
tests/
  screenshots/
    baseline/           # SCSS-only baseline
      chapter-headings.png
      chapter-body-typography.png
      chapter-blockquotes.png
      ...
    comparison/         # CSS custom properties
      chapter-headings.png
      chapter-body-typography.png
      ...
    diff/              # Automated diff images (future)
      chapter-headings-diff.png
      ...
```

## Creating Your Test Book

Your test book should include:

### Sample Chapter

Create a chapter with all components:

```html
<h1>Main Chapter Heading</h1>
<p>Body paragraph text with proper spacing and line height.</p>

<h2>Subheading Level 2</h2>
<p>More body text to test typography variables.</p>

<h3>Subheading Level 3</h3>

<blockquote>
  <p>A blockquote to test quote styling.</p>
</blockquote>

<h4>Lists</h4>
<ul>
  <li>Unordered list item 1</li>
  <li>Unordered list item 2</li>
</ul>

<ol>
  <li>Ordered list item 1</li>
  <li>Ordered list item 2</li>
</ol>

<h4>Tables</h4>
<table>
  <thead>
    <tr><th>Header 1</th><th>Header 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Cell 1</td><td>Cell 2</td></tr>
  </tbody>
</table>
```

### Front Matter

Create "Introduction" or "Preface" in Front Matter.

### Back Matter

Create "Appendix" or "About the Author" in Back Matter.

## Next Steps: Automated Testing

Once baseline screenshots are captured and validated:

1. **Set up Playwright test suite** (see `TESTING_PLAN.md`)
2. **Automate screenshot comparison** with pixelmatch or Playwright's built-in comparison
3. **Add to CI/CD** via GitHub Actions
4. **Define acceptance threshold** (e.g., <1% pixel difference)

## Troubleshooting

### SSL Certificate Errors

The script ignores HTTPS errors for local development. If issues persist:

```javascript
// In capture-baseline.js, chromium.launch options:
args: ['--ignore-certificate-errors']
```

### Book Not Found

Check your book slug in config:

```bash
# Visit your book directly
https://pressbooks.test/your-book-slug/
```

### No Screenshots Captured

Check console output for errors. Ensure:
- Lando is running: `lando start`
- Book exists and is published
- URLs are accessible

### Fonts Not Loading

Increase wait time in script:

```javascript
await page.waitForTimeout(2000); // Increase from 1000ms
```

## Manual Comparison Tools

### Image Diff Tools

- **Beyond Compare** (Windows/Mac)
- **Kaleidoscope** (Mac)
- **Meld** (Linux)
- **ImageMagick** (CLI): `compare baseline.png comparison.png diff.png`

### Browser Extensions

- **Visual Diff** extension for Chrome
- **Image Comparison** extension

## Configuration Options

### Viewport Sizes

Test different screen sizes:

```javascript
const CONFIG = {
  viewport: { width: 1280, height: 1024 }, // Desktop
  // viewport: { width: 768, height: 1024 },  // Tablet
  // viewport: { width: 375, height: 667 },   // Mobile
};
```

### Custom Pages

Add more pages to capture:

```javascript
pages: [
  {
    name: 'custom-page',
    path: '/chapter/your-chapter/',
    description: 'Custom test content'
  }
]
```

## Resources

- **Playwright Docs:** https://playwright.dev/
- **Visual Testing Guide:** https://playwright.dev/docs/test-snapshots
- **Pixelmatch:** https://github.com/mapbox/pixelmatch
- **TESTING_PLAN.md:** Comprehensive testing strategy
- **TEST_COMPONENTS.html:** HTML test page with all components
