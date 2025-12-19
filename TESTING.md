# Buckram Visual Regression Testing Guide

This guide explains how to run the Playwright visual regression tests to validate the CSS custom properties migration.

## Quick Start

```bash
# 1. Install dependencies
npm install
npm run playwright:install

# 2. Generate HTML test fixtures
npm run playwright:fixtures

# 3. Build both versions for comparison
composer build          # SCSS baseline
npm run build          # CSS variables version

# 4. Run the tests
npm run playwright:test
```

## What Gets Tested

The test suite validates that the CSS custom properties version produces **pixel-perfect identical output** to the SCSS baseline across:

- **Typography**: Body text, headings, paragraphs, blockquotes
- **Layout**: Tables, lists, images, figures
- **Book Structure**: Parts, chapters, front/back matter, TOC
- **Print Features**: Running headers, page numbers, page margins
- **Colors**: All element colors and backgrounds
- **Theme Overrides**: Custom property cascading and specificity

## Test Commands

### Basic Testing

```bash
# Run all tests
npm run playwright:test

# Run with UI mode (recommended for development)
npm run playwright:test:ui

# Run in debug mode (step through tests)
npm run playwright:test:debug

# View last test report
npm run playwright:report
```

### Targeted Testing

```bash
# Test only SCSS baseline
npm run playwright:baseline

# Test only CSS variables
npm run playwright:css

# Test only theme overrides
npm run playwright:overrides
```

### Test-Specific Commands

```bash
# Run a specific test file
npx playwright test baseline.spec.ts

# Run tests matching a pattern
npx playwright test --grep "typography"

# Run a single test
npx playwright test --grep "body element"
```

## Understanding Test Results

### Passing Tests ✅
When tests pass, the CSS variables version is visually identical to the SCSS baseline.

### Failing Tests ❌
When tests fail, visual differences were detected:

1. **Check the diff images**: Located in `test-results/` folder
2. **Review the HTML report**: Run `npm run playwright:report`
3. **Acceptable differences**: Update snapshots with `--update-snapshots`
4. **Bugs found**: Fix CSS variables or SCSS conversion

### Updating Baselines

If you've intentionally changed the visual output:

```bash
# Update all baseline screenshots
npx playwright test --update-snapshots

# Update specific test baselines
npx playwright test baseline.spec.ts --update-snapshots
```

## Test Output Formats

Tests validate output across all three Buckram formats:

- **`epub`**: EPUB ebook format
- **`prince`**: Prince PDF format with print features
- **`web`**: Web browser format

Each format is tested independently to catch format-specific issues.

## Troubleshooting

### Tests Won't Run

```bash
# Reinstall Playwright browsers
npm run playwright:install

# Clear test cache
rm -rf test-results screenshots
```

### Inconsistent Results

```bash
# Ensure both versions are built
composer build  # SCSS
npm run build   # CSS

# Regenerate fixtures
npm run playwright:fixtures
```

### Can't Find HTML Fixtures

```bash
# Generate fixtures
npm run playwright:fixtures

# Verify they exist
ls tests/visual-regression/fixtures/html/
```

### Visual Differences Detected

1. Review the diff in `test-results/`
2. Check if the difference is intentional
3. If intentional: `npx playwright test --update-snapshots`
4. If a bug: Fix the CSS custom property or SCSS conversion

## CI/CD Integration

Tests automatically run on:
- Push to `dev`, `production`, `feat/migrate-to-css-properties`
- Pull requests to `dev` or `production`

See `.github/workflows/visual-regression.yml` for details.

### GitHub Actions

The workflow:
1. Sets up PHP 8.3 and Node.js 22
2. Installs dependencies (Composer + npm)
3. Builds both SCSS and CSS versions
4. Runs all Playwright tests
5. Uploads test results and screenshots as artifacts
6. Comments on PRs with test results

### Viewing CI Results

1. Go to **Actions** tab in GitHub
2. Select the workflow run
3. Download artifacts: `playwright-results`, `playwright-screenshots`, `playwright-report`
4. Open `playwright-report/index.html` in a browser

## Test Development

### Adding New Tests

1. Add test to appropriate file:
   - `baseline.spec.ts` - Component comparisons
   - `theme-overrides.spec.ts` - Override tests
   - `regression.spec.ts` - Edge cases

2. Run in UI mode to develop:
   ```bash
   npm run playwright:test:ui
   ```

3. Generate baseline screenshots:
   ```bash
   npx playwright test your-test --update-snapshots
   ```

### Adding New Fixtures

1. Edit `tests/visual-regression/fixtures/generate-fixtures.ts`
2. Add new fixture generator function
3. Add to `fixtures` array
4. Regenerate: `npm run playwright:fixtures`

### Test Utilities

Available in `setup.ts`:

```typescript
// Load HTML fixture
await loadHTML(page, 'complete-chapter.html');

// Inject CSS file
await injectCSS(page, 'path/to/styles.css');

// Capture element screenshot
await captureElement(page, '.chapter-title');

// Compare screenshots
await compareScreenshots(page, 'test-name');
```

## Performance

- Tests run in parallel (2 workers by default)
- Chromium only (for consistency)
- Average test suite runtime: ~5 minutes
- Can be run headless or headed

## Best Practices

1. **Run tests frequently** while converting SCSS files
2. **Use UI mode** during development for faster iteration
3. **Update baselines** only when changes are intentional
4. **Review diffs carefully** before updating snapshots
5. **Test all formats** (epub, prince, web)
6. **Add regression tests** for any bugs found

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Visual Regression README](tests/visual-regression/README.md)
- [CSS Migration Progress](PHASE1_PROGRESS.md)
- [SCSS Conversion Progress](STEP2_PROGRESS.md)
