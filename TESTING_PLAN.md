# Comprehensive Testing Plan: CSS Custom Properties Migration

## Overview

This document outlines the testing strategy for the CSS custom properties migration across all Pressbooks output formats: webbooks, EPUB exports, and PDF exports.

## Testing Principles

1. **Format-Specific Testing** - Each format has unique requirements
2. **Visual Regression** - Compare before/after screenshots
3. **Automated Where Possible** - Unit, integration, and E2E tests
4. **Manual Verification** - Critical user flows and edge cases
5. **Performance Benchmarks** - Measure speed improvements
6. **Cross-Browser/Reader** - Test across platforms

## Test Matrix Overview

| Format | Test Types | Tools | Priority |
|--------|-----------|-------|----------|
| Webbook | Visual regression, functional, performance | Playwright, PHPUnit, Lighthouse | High |
| PDF | Visual regression, layout validation | PrinceXML, ImageMagick, PHPUnit | High |
| EPUB | Validation, reader testing, layout | EPUBCheck, Calibre, Apple Books | High |

---

## Part 1: Webbook Testing

### 1.1 Automated Unit Tests

**Location:** `tests/test-styles-webbook.php`

```php
<?php
namespace Pressbooks\Tests;

class WebBookStylesTest extends \WP_UnitTestCase {
    
    /**
     * Test that CSS custom properties are correctly generated
     * from theme options for webbook
     */
    public function test_webbook_css_custom_properties_generation(): void {
        $styles = \Pressbooks\Container::get('Styles');
        
        // Set some theme options
        update_option('pressbooks_theme_options_web', [
            'webbook_body_font' => 'Georgia',
            'paragraph_separation' => 'indent',
            'webbook_header_font' => 'Helvetica',
        ]);
        
        $css = $styles->optionsToCssProperties(
            get_option('pressbooks_theme_options_web'),
            'webbook_',
            'web'
        );
        
        // Assert custom properties are present
        $this->assertStringContainsString('--custom-body-font', $css);
        $this->assertStringContainsString('Georgia', $css);
        $this->assertStringContainsString('--custom-para-indent', $css);
    }
    
    /**
     * Test that webbook CSS loads correctly
     */
    public function test_webbook_css_loads(): void {
        $styles = \Pressbooks\Container::get('Styles');
        
        $css = $styles->getWebBookCSS();
        
        $this->assertNotEmpty($css);
        $this->assertStringContainsString(':root', $css);
        $this->assertStringContainsString('--', $css); // Has custom properties
    }
    
    /**
     * Test variable override chain
     */
    public function test_webbook_variable_override_chain(): void {
        $css = ":root { --h1-color: var(--custom-h1-color, var(--color-2)); }";
        
        // Parse and verify structure
        $this->assertStringContainsString('--custom-h1-color', $css);
        $this->assertStringContainsString('--color-2', $css);
    }
}
```

### 1.2 Visual Regression Testing

**Tool:** Playwright with screenshot comparison

**Setup:** `tests/playwright/webbook.spec.js`

```javascript
const { test, expect } = require('@playwright/test');
const { compareImages } = require('./helpers/image-compare');

test.describe('Webbook Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as admin, ensure book is set up
    await page.goto('/wp-admin');
    await page.fill('#user_login', process.env.WP_ADMIN_USER);
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS);
    await page.click('#wp-submit');
  });
  
  test('Chapter rendering matches baseline', async ({ page }) => {
    await page.goto('/test-book/chapter/chapter-1/');
    
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
    });
    
    // Compare to baseline
    expect(screenshot).toMatchSnapshot('chapter-1-webbook.png', {
      threshold: 0.01, // 1% difference allowed
    });
  });
  
  test('Heading styles render correctly', async ({ page }) => {
    await page.goto('/test-book/chapter/test-headings/');
    
    // Check computed styles
    const h1Color = await page.$eval('h1', el => 
      getComputedStyle(el).color
    );
    const h1Weight = await page.$eval('h1', el => 
      getComputedStyle(el).fontWeight
    );
    
    // Assert they match expected values
    expect(h1Color).toBe('rgb(185, 17, 9)'); // Example
    expect(h1Weight).toBe('700');
  });
  
  test('CSS custom properties are defined', async ({ page }) => {
    await page.goto('/test-book/chapter/chapter-1/');
    
    // Check custom properties in computed styles
    const rootStyles = await page.$eval(':root', el => {
      const styles = getComputedStyle(el);
      return {
        h1Color: styles.getPropertyValue('--h1-color'),
        bodyFont: styles.getPropertyValue('--body-font-family'),
      };
    });
    
    expect(rootStyles.h1Color).toBeTruthy();
    expect(rootStyles.bodyFont).toBeTruthy();
  });
  
  test('Theme option changes update CSS', async ({ page }) => {
    // Go to theme options
    await page.goto('/wp-admin/themes.php?page=pb_custom_styles');
    
    // Change a color option
    await page.fill('#custom-h1-color', '#FF0000');
    await page.click('#submit');
    
    // Wait for save
    await page.waitForSelector('.updated');
    
    // Check webbook
    await page.goto('/test-book/chapter/chapter-1/');
    const h1Color = await page.$eval('h1', el => 
      getComputedStyle(el).color
    );
    
    expect(h1Color).toBe('rgb(255, 0, 0)');
  });
});
```

### 1.3 Performance Testing

**Tool:** Lighthouse CI

**Config:** `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost/test-book/',
        'http://localhost/test-book/chapter/chapter-1/',
        'http://localhost/test-book/front-matter/preface/',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
      },
    },
  },
};
```

### 1.4 Cross-Browser Testing

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Cases:**
- [ ] Custom properties render correctly
- [ ] Font families load properly
- [ ] Colors display accurately
- [ ] Layout is consistent
- [ ] Responsive design works

---

## Part 2: PDF Export Testing

### 2.1 Automated Unit Tests

**Location:** `tests/test-pdf-export.php`

```php
<?php
namespace Pressbooks\Tests\Export;

class PDFExportTest extends \WP_UnitTestCase {
    
    use \Pressbooks\Tests\utilsTrait;
    
    public function setUp(): void {
        parent::setUp();
        $this->_book();
    }
    
    /**
     * Test PDF CSS generation with custom properties
     */
    public function test_pdf_css_custom_properties_generation(): void {
        update_option('pressbooks_theme_options_pdf', [
            'pdf_body_font_family' => 'Times New Roman',
            'pdf_body_font_size' => '11pt',
            'pdf_page_width' => '6in',
            'pdf_page_height' => '9in',
        ]);
        
        $pdf = new \Pressbooks\Modules\Export\Prince\PDF([]);
        $css = $this->invokeMethod($pdf, 'getCSS');
        
        $this->assertStringContainsString('--custom-body-font-family: "Times New Roman"', $css);
        $this->assertStringContainsString('--custom-page-width: 6in', $css);
    }
    
    /**
     * Test page layout logic
     */
    public function test_pdf_page_layout_blank_pages(): void {
        $pageLayout = new \Pressbooks\Export\PageLayout();
        
        // Test with blank pages included
        $options = ['pdf_blank_pages' => 'include'];
        $shouldInsert = $pageLayout->shouldInsertBlankPage(
            'chapter',
            'previous-chapter', 
            5, // Odd page
            $options
        );
        
        $this->assertTrue($shouldInsert);
        
        // Test with blank pages removed
        $options = ['pdf_blank_pages' => 'remove'];
        $shouldInsert = $pageLayout->shouldInsertBlankPage(
            'chapter',
            'previous-chapter',
            5,
            $options
        );
        
        $this->assertFalse($shouldInsert);
    }
    
    /**
     * Test PDF export completes successfully
     */
    public function test_pdf_export_completes(): void {
        $pdf = new \Pressbooks\Modules\Export\Prince\PDF([]);
        
        $result = $pdf->convert();
        
        $this->assertTrue($result);
        $this->assertFileExists($pdf->getOutputPath());
    }
}
```

### 2.2 Visual Regression Testing

**Tool:** ImageMagick for PDF comparison

**Script:** `tests/scripts/compare-pdfs.sh`

```bash
#!/bin/bash

# Compare two PDFs visually
# Usage: ./compare-pdfs.sh baseline.pdf test.pdf output-dir

BASELINE=$1
TEST=$2
OUTPUT_DIR=$3

mkdir -p "$OUTPUT_DIR"

# Convert PDFs to PNGs
convert -density 150 "$BASELINE" -quality 90 "$OUTPUT_DIR/baseline-%04d.png"
convert -density 150 "$TEST" -quality 90 "$OUTPUT_DIR/test-%04d.png"

# Compare each page
DIFF_FOUND=0
for baseline_page in "$OUTPUT_DIR"/baseline-*.png; do
    page_num=$(basename "$baseline_page" | sed 's/baseline-\(.*\)\.png/\1/')
    test_page="$OUTPUT_DIR/test-${page_num}.png"
    diff_page="$OUTPUT_DIR/diff-${page_num}.png"
    
    if [ -f "$test_page" ]; then
        # Compare images
        compare -metric AE -fuzz 5% \
            "$baseline_page" "$test_page" \
            "$diff_page" 2> "$OUTPUT_DIR/diff-${page_num}.txt" || DIFF_FOUND=1
    fi
done

if [ $DIFF_FOUND -eq 1 ]; then
    echo "Differences found in PDF rendering"
    exit 1
else
    echo "PDFs match within tolerance"
    exit 0
fi
```

**PHP Test:**
```php
public function test_pdf_visual_regression(): void {
    // Generate baseline PDF (with SCSS)
    $baselinePdf = $this->generateBaselinePDF();
    
    // Generate test PDF (with CSS custom properties)
    $testPdf = $this->generateTestPDF();
    
    // Compare
    $script = PB_PLUGIN_DIR . 'tests/scripts/compare-pdfs.sh';
    $output = sys_get_temp_dir() . '/pdf-comparison';
    
    exec("$script $baselinePdf $testPdf $output", $outputLines, $returnCode);
    
    $this->assertEquals(0, $returnCode, "PDF visual regression test failed");
}
```

### 2.3 Layout Validation Tests

**Tests for:**
- [ ] Page breaks occur correctly
- [ ] Chapters start on correct page (recto/verso)
- [ ] Blank pages inserted when configured
- [ ] Running headers/footers display correctly
- [ ] Page numbers in correct position
- [ ] TOC links work correctly
- [ ] Margins are correct dimensions
- [ ] Fonts embed properly

**Example Test:**
```php
public function test_pdf_chapters_start_on_recto_page(): void {
    update_option('pressbooks_theme_options_pdf', [
        'pdf_chapter_start_page' => 'recto',
        'pdf_blank_pages' => 'include',
    ]);
    
    $pdf = new \Pressbooks\Modules\Export\Prince\PDF([]);
    $pdfPath = $pdf->convert();
    
    // Parse PDF to find chapter start pages
    $parser = new \Smalot\PdfParser\Parser();
    $pdfObj = $parser->parseFile($pdfPath);
    $pages = $pdfObj->getPages();
    
    // Check that chapters start on odd-numbered pages (recto)
    foreach ($pages as $pageNum => $page) {
        $text = $page->getText();
        if (strpos($text, 'Chapter ') === 0) {
            // Page numbers are 0-indexed, so odd index = even page number = recto
            $this->assertEquals(0, $pageNum % 2, 
                "Chapter should start on recto page, but found on page " . ($pageNum + 1)
            );
        }
    }
}
```

### 2.4 PrinceXML Compatibility Testing

**Test Cases:**
- [ ] PrinceXML can parse generated CSS
- [ ] No CSS warnings in Prince log
- [ ] Custom properties resolve correctly
- [ ] @page rules work as expected
- [ ] Running content strings work
- [ ] Bookmarks are created correctly

**Test:**
```php
public function test_prince_css_is_valid(): void {
    $pdf = new \Pressbooks\Modules\Export\Prince\PDF([]);
    $css = $this->invokeMethod($pdf, 'getCSS');
    
    // Write CSS to temp file
    $cssFile = sys_get_temp_dir() . '/test-prince.css';
    file_put_contents($cssFile, $css);
    
    // Create minimal HTML
    $html = '<!DOCTYPE html><html><head><link rel="stylesheet" href="' . $cssFile . '"></head><body><p>Test</p></body></html>';
    $htmlFile = sys_get_temp_dir() . '/test-prince.html';
    file_put_contents($htmlFile, $html);
    
    // Run PrinceXML
    $pdfFile = sys_get_temp_dir() . '/test-prince.pdf';
    $logFile = sys_get_temp_dir() . '/test-prince.log';
    
    exec("prince $htmlFile -o $pdfFile --log=$logFile 2>&1", $output, $returnCode);
    
    // Check for CSS errors in log
    $log = file_get_contents($logFile);
    $this->assertStringNotContainsString('error', strtolower($log));
    $this->assertStringNotContainsString('warning: unsupported', strtolower($log));
    $this->assertEquals(0, $returnCode);
}
```

---

## Part 3: EPUB Export Testing

### 3.1 Automated Unit Tests

**Location:** `tests/test-epub-export.php`

```php
<?php
namespace Pressbooks\Tests\Export;

class EPUBExportTest extends \WP_UnitTestCase {
    
    use \Pressbooks\Tests\utilsTrait;
    
    public function setUp(): void {
        parent::setUp();
        $this->_book();
    }
    
    /**
     * Test EPUB CSS generation with custom properties
     */
    public function test_epub_css_custom_properties(): void {
        update_option('pressbooks_theme_options_ebook', [
            'ebook_body_font' => 'Georgia',
            'ebook_body_font_size' => 'medium',
        ]);
        
        $epub = new \Pressbooks\Modules\Export\Epub\Epub3([]);
        $css = $this->invokeMethod($epub, 'getCSS');
        
        $this->assertStringContainsString(':root', $css);
        $this->assertStringContainsString('--custom-body-font', $css);
    }
    
    /**
     * Test EPUB export completes
     */
    public function test_epub_export_completes(): void {
        $epub = new \Pressbooks\Modules\Export\Epub\Epub3([]);
        
        $result = $epub->convert();
        
        $this->assertTrue($result);
        $this->assertFileExists($epub->getOutputPath());
    }
    
    /**
     * Test EPUB structure is valid
     */
    public function test_epub_structure_valid(): void {
        $epub = new \Pressbooks\Modules\Export\Epub\Epub3([]);
        $epubPath = $epub->convert();
        
        // Extract EPUB
        $extractDir = sys_get_temp_dir() . '/epub-test';
        $zip = new \ZipArchive();
        $zip->open($epubPath);
        $zip->extractTo($extractDir);
        $zip->close();
        
        // Check required files exist
        $this->assertFileExists($extractDir . '/mimetype');
        $this->assertFileExists($extractDir . '/META-INF/container.xml');
        
        // Check CSS is included
        $this->assertFileExists($extractDir . '/OEBPS/css/style.css');
        
        // Verify CSS contains custom properties
        $css = file_get_contents($extractDir . '/OEBPS/css/style.css');
        $this->assertStringContainsString(':root', $css);
    }
}
```

### 3.2 EPUBCheck Validation

**Tool:** EPUBCheck validator

**Test:**
```php
public function test_epub_passes_epubcheck(): void {
    $epub = new \Pressbooks\Modules\Export\Epub\Epub3([]);
    $epubPath = $epub->convert();
    
    // Run EPUBCheck
    $epubcheckJar = '/path/to/epubcheck.jar';
    exec("java -jar $epubcheckJar $epubPath", $output, $returnCode);
    
    $outputStr = implode("\n", $output);
    
    // Assert no errors
    $this->assertEquals(0, $returnCode, "EPUBCheck found errors: $outputStr");
    $this->assertStringContainsString('No errors', $outputStr);
}
```

### 3.3 EPUB Reader Testing

**Manual Testing Matrix:**

| Reader | Platform | Tests |
|--------|----------|-------|
| Apple Books | macOS/iOS | Fonts, colors, layout, custom properties |
| Google Play Books | Android/Web | Fonts, colors, layout |
| Kindle | E-Ink/App | Fonts, colors (limited), layout |
| Calibre | Desktop | Fonts, colors, layout, custom properties |
| Adobe Digital Editions | Desktop | Fonts, colors, layout |

**Test Checklist for Each Reader:**
- [ ] EPUB opens without errors
- [ ] Fonts display correctly
- [ ] Colors render accurately
- [ ] Headings styled properly
- [ ] Images display correctly
- [ ] Links work
- [ ] TOC navigates correctly
- [ ] Reader settings override custom properties appropriately

### 3.4 CSS Support Testing

**Test custom property support in EPUB readers:**

```php
public function test_epub_css_custom_properties_support(): void {
    // Create test EPUB with custom properties
    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --test-color: red;
            --test-font-size: 16px;
        }
        p {
            color: var(--test-color);
            font-size: var(--test-font-size);
        }
    </style>
</head>
<body>
    <p>Test paragraph</p>
</body>
</html>
HTML;
    
    // Build EPUB
    $epub = $this->createTestEPUB($html);
    
    // Run EPUBCheck to ensure CSS is valid
    $this->assertEPUBValid($epub);
    
    // Manual verification needed for reader support
}
```

---

## Part 4: Integration Testing

### 4.1 Theme Options Integration

**Test that theme options correctly generate CSS custom properties across all formats:**

```php
public function test_theme_options_integration_all_formats(): void {
    // Set theme options
    update_option('pressbooks_theme_options_global', [
        'chapter_numbers' => true,
    ]);
    
    update_option('pressbooks_theme_options_web', [
        'webbook_body_font' => 'Georgia',
    ]);
    
    update_option('pressbooks_theme_options_pdf', [
        'pdf_body_font_family' => 'Times New Roman',
    ]);
    
    update_option('pressbooks_theme_options_ebook', [
        'ebook_body_font' => 'Georgia',
    ]);
    
    // Test web
    $webCSS = \Pressbooks\Container::get('Styles')->getWebBookCSS();
    $this->assertStringContainsString('Georgia', $webCSS);
    
    // Test PDF
    $pdf = new \Pressbooks\Modules\Export\Prince\PDF([]);
    $pdfCSS = $this->invokeMethod($pdf, 'getCSS');
    $this->assertStringContainsString('Times New Roman', $pdfCSS);
    
    // Test EPUB
    $epub = new \Pressbooks\Modules\Export\Epub\Epub3([]);
    $epubCSS = $this->invokeMethod($epub, 'getCSS');
    $this->assertStringContainsString('Georgia', $epubCSS);
}
```

### 4.2 Theme Compatibility Testing

**Test that child themes can override custom properties:**

```php
public function test_child_theme_overrides_work(): void {
    // Switch to test child theme
    switch_theme('pressbooks-test-child');
    
    // Child theme should have custom properties set
    $css = \Pressbooks\Container::get('Styles')->getWebBookCSS();
    
    // Should contain child theme overrides
    $this->assertStringContainsString('--custom-h1-color', $css);
}
```

---

## Part 5: Performance Testing

### 5.1 Benchmark Tests

**Compare SCSS vs CSS Custom Properties performance:**

```php
public function test_performance_comparison(): void {
    // SCSS compilation time
    $scssStart = microtime(true);
    for ($i = 0; $i < 10; $i++) {
        $this->compileWithSCSS();
    }
    $scssTime = microtime(true) - $scssStart;
    
    // CSS custom properties time
    $cssStart = microtime(true);
    for ($i = 0; $i < 10; $i++) {
        $this->generateWithCustomProperties();
    }
    $cssTime = microtime(true) - $cssStart;
    
    // Custom properties should be significantly faster
    $this->assertLessThan($scssTime * 0.5, $cssTime, 
        "CSS custom properties should be at least 2x faster than SCSS compilation"
    );
}
```

### 5.2 Memory Usage Tests

```php
public function test_memory_usage_comparison(): void {
    // SCSS memory usage
    $scssMemoryStart = memory_get_usage();
    $this->compileWithSCSS();
    $scssMemory = memory_get_usage() - $scssMemoryStart;
    
    // CSS custom properties memory usage
    $cssMemoryStart = memory_get_usage();
    $this->generateWithCustomProperties();
    $cssMemory = memory_get_usage() - $cssMemoryStart;
    
    // Custom properties should use less memory
    $this->assertLessThan($scssMemory * 0.5, $cssMemory,
        "CSS custom properties should use significantly less memory"
    );
}
```

---

## Part 6: Manual Testing Procedures

### 6.1 Web Book Manual Checklist

**Test Book:** Create standardized test book with variety of content

**Checklist:**
- [ ] Homepage displays correctly
- [ ] Chapter navigation works
- [ ] Fonts load properly
- [ ] Colors match theme
- [ ] Responsive design works
- [ ] Dark mode (if applicable)
- [ ] Print styles work
- [ ] Accessibility features work
- [ ] TOC displays correctly
- [ ] Search works
- [ ] Images display properly
- [ ] Tables format correctly
- [ ] Textboxes styled correctly
- [ ] Footnotes/endnotes work
- [ ] Glossary displays correctly

### 6.2 PDF Manual Checklist

**Test different page sizes and options:**

**US Trade (6×9):**
- [ ] Margins correct
- [ ] Headers/footers positioned correctly
- [ ] Page numbers correct
- [ ] Chapters start on recto pages (if configured)
- [ ] Blank pages inserted correctly
- [ ] Running content displays
- [ ] TOC links work
- [ ] Fonts embed correctly
- [ ] Images scale properly
- [ ] Page breaks appropriate
- [ ] Widows/orphans controlled

**Repeat for:**
- [ ] US Letter (8.5×11)
- [ ] A4 (210×297mm)
- [ ] Custom size
- [ ] Landscape orientation

### 6.3 EPUB Manual Checklist

**Test in each reader:**

**Apple Books:**
- [ ] EPUB opens without errors
- [ ] Fonts load correctly
- [ ] Night mode works
- [ ] Font size changes work
- [ ] Images display
- [ ] Links work
- [ ] TOC navigates
- [ ] Search works

**Repeat for:**
- [ ] Google Play Books
- [ ] Kindle app
- [ ] Calibre
- [ ] Adobe Digital Editions

---

## Part 7: Regression Testing

### 7.1 Baseline Establishment

**Before migration:**
1. Generate test book exports in all formats
2. Take screenshots of web book
3. Store as baseline for comparison
4. Document any known issues

### 7.2 Ongoing Regression Suite

**Run after each phase:**
```bash
# Run full regression suite
npm run test:regression

# Runs:
# - Visual regression tests (web, PDF screenshots)
# - Layout validation (PDF page structure)
# - EPUB validation (EPUBCheck)
# - Performance benchmarks
# - Cross-browser tests
```

---

## Part 8: Test Automation

### 8.1 GitHub Actions Workflow

`.github/workflows/css-custom-properties-tests.yml`:
```yaml
name: CSS Custom Properties Tests

on: [push, pull_request]

jobs:
  phpunit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: composer install
      - name: Run PHPUnit tests
        run: composer test
  
  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Playwright
        run: npm ci && npx playwright install
      - name: Run Playwright tests
        run: npm run test:playwright
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-screenshots
          path: test-results/
  
  epub-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Java
        uses: actions/setup-java@v3
      - name: Download EPUBCheck
        run: wget https://github.com/w3c/epubcheck/releases/download/v5.0.0/epubcheck-5.0.0.zip
      - name: Run EPUB tests
        run: composer test -- --group epub
      - name: Validate EPUBs
        run: npm run validate:epub
```

---

## Part 9: Test Data

### 9.1 Test Book Structure

Create standardized test book with:

**Front Matter:**
- Copyright page
- Dedication
- Preface
- Introduction

**Body:**
- Part 1
  - Chapter 1 (test all heading levels)
  - Chapter 2 (test images)
  - Chapter 3 (test tables)
  - Chapter 4 (test textboxes)
- Part 2
  - Chapter 5 (test lists)
  - Chapter 6 (test blockquotes)
  - Chapter 7 (test footnotes)

**Back Matter:**
- Appendix
- Glossary
- Bibliography

### 9.2 Test Content Elements

Include examples of:
- All heading levels (h1-h6)
- Paragraphs (various lengths)
- Blockquotes (short and long)
- Lists (ordered, unordered, nested)
- Tables (simple, complex, with headers)
- Images (inline, figures, different sizes)
- Textboxes (all types)
- Code blocks
- Math equations (if MathJax enabled)
- Footnotes and endnotes
- Links (internal, external)
- Special characters
- Non-Latin scripts (if applicable)

---

## Part 10: Success Criteria

### 10.1 Exit Criteria

Migration is successful when:

**Functionality:**
- [ ] All automated tests pass
- [ ] Visual regression tests show no significant differences
- [ ] EPUBCheck validation passes
- [ ] Manual tests complete successfully
- [ ] No CSS errors in browser console
- [ ] No PrinceXML warnings

**Performance:**
- [ ] Web page load time ≤ previous
- [ ] PDF generation time improved by ≥50%
- [ ] EPUB generation time improved by ≥30%
- [ ] Memory usage reduced by ≥40%

**Quality:**
- [ ] Code coverage ≥80%
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Migration guide tested

**Compatibility:**
- [ ] Works in all supported browsers
- [ ] Works in all tested EPUB readers
- [ ] PrinceXML compatibility maintained
- [ ] Existing themes work (with compat layer)

---

## Test Execution Schedule

### Phase 1: Unit Tests
- **Week 1-2:** Write unit tests for simple variables
- **Week 3-4:** Test PHP integration code
- **Continuous:** Run on every commit

### Phase 2: Integration Tests
- **Week 5-6:** Theme options integration
- **Week 7-8:** Export system integration
- **Continuous:** Run daily

### Phase 3: Visual Regression
- **Week 9:** Set up baseline
- **Week 10-11:** Implement tests
- **Week 12+:** Run on every PR

### Phase 4: Manual Testing
- **Week 13-14:** Complete manual checklists
- **Week 15:** Bug fixes
- **Week 16:** Final verification

---

## Tools and Resources

### Testing Tools
- **PHPUnit** - PHP unit tests
- **Playwright** - Browser automation
- **Lighthouse** - Performance audits
- **EPUBCheck** - EPUB validation
- **ImageMagick** - PDF comparison
- **PrinceXML** - PDF generation
- **Calibre** - EPUB reading/conversion

### Test Book Repository
- Maintain standardized test book
- Version control test content
- Share across team

### Reporting
- Generate HTML test reports
- Track test coverage over time
- Dashboard for test status

---

**Last Updated:** December 18, 2024  
**Maintained by:** Pressbooks QA Team
