# Playwright Test Suite - Complete Implementation

## ✅ What We Built

A comprehensive visual regression test suite for validating the CSS custom properties migration in Buckram.

## 📁 Files Created

### Configuration & Setup
1. **`playwright.config.ts`** (136 lines)
   - Three test projects: baseline-scss, css-variables, theme-overrides
   - Screenshot comparison with 0.2% threshold
   - Parallel execution (2 workers)
   - HTML report generation

2. **`tsconfig.json`** (20 lines)
   - TypeScript configuration for test files
   - ES2020 target with DOM types
   - Strict mode enabled

### Test Files
3. **`tests/visual-regression/setup.ts`** (219 lines)
   - `loadHTML()` - Load HTML fixtures
   - `compareScreenshots()` - Visual comparison utility
   - `injectCSS()` - Inject stylesheets
   - `captureElement()` - Screenshot helper
   - HTML fixture templates

4. **`tests/visual-regression/baseline.spec.ts`** (368 lines)
   - Typography tests (body, headings, paragraphs)
   - Layout tests (tables, lists, images)
   - Book structure tests (parts, chapters, TOC)
   - Print formatting tests (running headers, page numbers)
   - Color tests (all elements)

5. **`tests/visual-regression/theme-overrides.spec.ts`** (154 lines)
   - Custom :root override tests
   - Font override tests
   - Color override tests
   - Spacing override tests

6. **`tests/visual-regression/regression.spec.ts`** (200 lines)
   - Map-based variable tests
   - Nested element inheritance tests
   - Complex selector tests
   - Print-specific feature tests

### Fixture Generation
7. **`tests/visual-regression/fixtures/generate-fixtures.ts`** (340 lines)
   - Generates 7 HTML fixtures:
     - `complete-chapter.html` - Full chapter with all elements
     - `part-opener.html` - Part title page
     - `front-matter.html` - Dedication sample
     - `back-matter.html` - About author sample
     - `typography-specimen.html` - All text styles
     - `table-of-contents.html` - TOC structure
     - `prince-page.html` - PDF with running headers

### Documentation
8. **`tests/visual-regression/README.md`** (252 lines)
   - Test suite overview
   - Setup instructions
   - Test execution commands
   - CI/CD integration guidance
   - Troubleshooting tips

9. **`TESTING.md`** (220 lines)
   - Comprehensive testing guide
   - Quick start instructions
   - Command reference
   - Test development guide
   - CI/CD details

### CI/CD
10. **`.github/workflows/visual-regression.yml`** (65 lines)
    - Automated testing on push/PR
    - PHP 8.3 + Node.js 22 setup
    - Builds both SCSS and CSS versions
    - Uploads test results and screenshots
    - PR comment with results

### Package Configuration
11. **Updated `package.json`**
    - Added TypeScript dependencies: `typescript`, `ts-node`, `@types/node`
    - Added 8 new scripts:
      - `playwright:install` - Install browsers
      - `playwright:fixtures` - Generate HTML fixtures
      - `playwright:test` - Run all tests
      - `playwright:test:ui` - Run with UI mode
      - `playwright:test:debug` - Debug mode
      - `playwright:baseline` - Test SCSS baseline
      - `playwright:css` - Test CSS variables
      - `playwright:overrides` - Test theme overrides
      - `playwright:report` - View test report

## 📊 Test Coverage

### Components Tested
- ✅ Body element styling
- ✅ Heading levels 1-6
- ✅ Paragraphs (first-para, standard, indented)
- ✅ Blockquotes with citations
- ✅ Lists (ordered, unordered, nested)
- ✅ Tables with captions
- ✅ Images and figures
- ✅ Code blocks and inline code
- ✅ Textboxes/callouts
- ✅ Footnotes
- ✅ Part openers
- ✅ Front matter
- ✅ Back matter
- ✅ Table of contents
- ✅ Running headers
- ✅ Page numbers
- ✅ Colors (all elements)

### Output Formats
- ✅ EPUB format (`.epub` class)
- ✅ Prince PDF format (`.prince` class)
- ✅ Web format

### Test Types
- ✅ Baseline comparison (SCSS vs CSS)
- ✅ Theme override capability
- ✅ Edge case handling
- ✅ Format-specific features
- ✅ Nested inheritance
- ✅ Complex selectors

## 🚀 How to Use

### 1. Setup (one-time)
```bash
npm install
npm run playwright:install
npm run playwright:fixtures
```

### 2. Build both versions
```bash
composer build  # SCSS baseline
npm run build   # CSS variables
```

### 3. Run tests
```bash
# All tests
npm run playwright:test

# UI mode (recommended for development)
npm run playwright:test:ui

# Debug mode
npm run playwright:test:debug
```

### 4. Review results
```bash
# View HTML report
npm run playwright:report

# Check test-results/ folder for diffs
```

## 🎯 Next Steps

1. **Generate fixtures:**
   ```bash
   npm run playwright:fixtures
   ```

2. **Install Playwright:**
   ```bash
   npm install
   npm run playwright:install
   ```

3. **Build baseline SCSS version:**
   ```bash
   composer build
   ```

4. **Build CSS variables version:**
   ```bash
   npm run build
   ```

5. **Run initial test:**
   ```bash
   npm run playwright:test:ui
   ```

6. **Continue SCSS conversions** - Test each file as it's converted

## 💡 Test Strategy

The test suite validates the migration by:

1. **Baseline Comparison**: Screenshots of SCSS baseline vs CSS variables are compared pixel-by-pixel
2. **Threshold**: 0.2% difference allowed (handles anti-aliasing variations)
3. **Full Coverage**: Tests all Buckram components and formats
4. **Theme Validation**: Ensures CSS custom properties can be overridden
5. **Regression Prevention**: Tests edge cases and known issues

## 🔄 CI/CD Integration

Tests run automatically on:
- Push to `dev`, `production`, `feat/migrate-to-css-properties`
- Pull requests to `dev` or `production`

Results are:
- Uploaded as GitHub Actions artifacts
- Posted as PR comments
- Viewable in HTML report

## 📈 Test Metrics

- **Total test files**: 3 (baseline, overrides, regression)
- **Total lines of test code**: ~740 lines
- **HTML fixtures**: 7 files
- **Test utilities**: 4 helper functions
- **Screenshot threshold**: 0.2% pixel difference
- **Formats tested**: 3 (epub, prince, web)
- **Browser**: Chromium (for consistency)
- **Parallel workers**: 2

## 🎉 Benefits

1. **Confidence**: Know CSS variables produce identical output
2. **Speed**: Automated validation vs manual checking
3. **Coverage**: Tests every component and format
4. **Regression**: Catches unintended changes
5. **Documentation**: Tests serve as living documentation
6. **CI/CD**: Automatic validation on every commit
7. **Theme Development**: Validates custom property overrides work

## 📝 Documentation

- **Quick Start**: [TESTING.md](TESTING.md)
- **Detailed Guide**: [tests/visual-regression/README.md](tests/visual-regression/README.md)
- **Fixture Generator**: [tests/visual-regression/fixtures/generate-fixtures.ts](tests/visual-regression/fixtures/generate-fixtures.ts)
- **CI Workflow**: [.github/workflows/visual-regression.yml](.github/workflows/visual-regression.yml)

## ✨ Status

**Test suite complete and ready to use!**

Run `npm run playwright:fixtures && npm run playwright:test:ui` to start testing.
