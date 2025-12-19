# Buckram Visual Regression Test Suite

Playwright-based visual regression testing for the CSS custom properties migration.

## Overview

This test suite ensures that the migrated CSS custom properties produce visually identical output to the original SCSS baseline across all components and output formats (web, EPUB, Prince PDF).

## Test Structure

### Test Files

- **`baseline.spec.ts`**: Compares SCSS baseline vs CSS variables for all components
- **`theme-overrides.spec.ts`**: Tests that CSS custom properties can be overridden by themes
- **`regression.spec.ts`**: Tests for specific edge cases and known issues
- **`setup.ts`**: Shared utilities and test helpers

## Running Tests

### Install Dependencies

```bash
npm install
npm run playwright:install
```

### Generate HTML Fixtures

```bash
npm run playwright:fixtures
```

### Build Baseline and CSS Versions

```bash
# Build SCSS baseline
composer build

# Build CSS variables version
npm run build
```

### Run All Tests

```bash
npm run playwright:test
```

### Run Specific Test Suite

```bash
# Baseline comparison only
npx playwright test baseline

# Theme overrides only
npx playwright test theme-overrides

# Regression tests only
npx playwright test regression
```

### Run for Specific Browser/Format

```bash
# Web tests in Chromium
npx playwright test --project=web-chromium

# Prince PDF tests
npx playwright test --project=prince-pdf

# Mobile web tests
npx playwright test --project=web-mobile
```

### Update Baseline Screenshots

When intentionally changing styles:

```bash
npx playwright test --update-snapshots
```

## Test Coverage

### Components Tested

- Body text and typography
- Headings (H1-H6)
- Paragraphs (indentation, hyphenation, tracking)
- Blockquotes
- Lists (ordered, unordered, definition)
- Tables (with various styles)
- Links
- Images (floated, captioned)
- Footnotes and endnotes
- Section titles (chapters, parts, front/back matter)
- Title pages
- Table of Contents
- Running headers and footers
- Textboxes and sidebars
- Pullquotes (left, right, outside)
- Columns (two, three-column layouts)
- Code blocks and pre-formatted text

### Output Formats

- **Web**: Desktop (Chrome, Firefox, Safari) and mobile (iPhone, iPad)
- **EPUB**: E-reader viewport simulations
- **Prince PDF**: Print layout at 8.5×11 inch page size

### Theme Override Tests

Tests verify that the following can be customized via CSS custom properties:

- Font families (body, headings)
- Font sizes
- Colors (text, headings, links, etc.)
- Spacing (margins, padding, indentation)
- Borders and backgrounds
- Page layout (margins for print)
- Running headers/footers

## Test Results

### Viewing Results

After running tests:

```bash
npx playwright show-report
```

### CI Integration

Tests run automatically on pull requests and report:
- Visual diffs for any failures
- Screenshot comparisons
- Test execution time
- Coverage across browsers/formats

## Debugging Tests

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Run with UI

```bash
npx playwright test --ui
```

### View Trace

```bash
npx playwright show-trace trace.zip
```

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { loadTestBook } from './setup';

test('my new component test', async ({ page }) => {
  await loadTestBook(page, 'component-name', {
    format: 'web',
    useCSSVariables: true
  });
  
  await expect(page.locator('.my-element')).toHaveScreenshot('my-test.png');
});
```

### Custom Properties Test Template

```typescript
test('can override my property', async ({ page }) => {
  await loadTestBook(page, 'component-name', {
    format: 'web',
    useCSSVariables: true,
    customProperties: {
      'my-property': 'new-value'
    }
  });
  
  const computed = await page.locator('.my-element').evaluate(
    el => window.getComputedStyle(el).myProperty
  );
  
  expect(computed).toBe('new-value');
});
```

## Configuration

### Screenshot Comparison Settings

Defined in `playwright.config.ts`:

- `maxDiffPixels`: 100 pixels maximum difference
- `maxDiffPixelRatio`: 1% maximum pixel difference ratio
- `threshold`: 0.2 sensitivity for considering pixels as different
- Animations disabled for consistency

### Viewport Sizes

- Web desktop: 1024×768
- Web mobile: iPhone 13 (390×844)
- Web tablet: iPad Pro (1024×1366)
- EPUB: 600×800
- Prince PDF: 816×1056 (8.5×11 inch at 96dpi)

## Troubleshooting

### Tests Failing After Style Changes

1. Review the visual diff in the HTML report
2. If change is intentional, update snapshots: `npx playwright test --update-snapshots`
3. If unintentional, fix the CSS and re-run tests

### Font Loading Issues

- Tests wait for `document.fonts.ready` before screenshots
- Ensure test pages include necessary web fonts
- Check font fallbacks are properly configured

### Prince PDF Tests

- Requires Prince XML installed locally
- Alternative: Use headless Chrome with print CSS emulation
- Page size settings in config must match Prince output

### Performance

- Tests run in parallel by default
- Use `--workers=1` for sequential execution if needed
- Consider sharding for large test suites in CI

## Continuous Integration

### GitHub Actions Workflow

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run visual regression tests
  run: npm run test:visual

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: test-results/
```

## Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
- [Buckram CSS Variables Migration](../STEP2_PROGRESS.md)
