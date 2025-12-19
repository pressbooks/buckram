/**
 * Baseline Screenshot Capture Script
 * 
 * Captures screenshots of a Pressbooks webbook for visual regression testing
 * during SCSS → CSS Custom Properties migration.
 * 
 * Usage:
 *   node capture-baseline.js
 * 
 * Requirements:
 *   - Playwright installed: npm install -D @playwright/test
 *   - Local Pressbooks instance running (e.g., pressbooks.test via Lando)
 *   - Test book available with sample content
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'https://pressbooks.test',
  bookSlug: 'testreference',
  screenshotDir: './tests/screenshots',
  viewport: { width: 1280, height: 1024 },
  
  // Pages to capture
  pages: [
    {
      name: 'chapter-headings',
      path: '/chapter/sample-chapter/',
      description: 'Chapter with all heading levels (H1-H6)'
    },
    {
      name: 'chapter-body-typography',
      path: '/chapter/sample-chapter/',
      description: 'Body text, paragraphs, line spacing'
    },
    {
      name: 'chapter-blockquotes',
      path: '/chapter/sample-chapter/',
      description: 'Blockquotes styling'
    },
    {
      name: 'chapter-lists',
      path: '/chapter/sample-chapter/',
      description: 'Ordered and unordered lists'
    },
    {
      name: 'chapter-tables',
      path: '/chapter/sample-chapter/',
      description: 'Table styling'
    },
    {
      name: 'chapter-images',
      path: '/chapter/sample-chapter/',
      description: 'Images with captions'
    },
    {
      name: 'chapter-textbox',
      path: '/chapter/sample-chapter/',
      description: 'Textboxes and special elements'
    },
    {
      name: 'front-matter',
      path: '/front-matter/introduction/',
      description: 'Front matter page'
    },
    {
      name: 'back-matter',
      path: '/back-matter/appendix/',
      description: 'Back matter page'
    }
  ]
};

/**
 * Ensure screenshot directory exists
 */
function setupDirectories() {
  const baselineDir = path.join(CONFIG.screenshotDir, 'baseline');
  const comparisonDir = path.join(CONFIG.screenshotDir, 'comparison');
  const diffDir = path.join(CONFIG.screenshotDir, 'diff');
  
  [baselineDir, comparisonDir, diffDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  return { baselineDir, comparisonDir, diffDir };
}

/**
 * Capture screenshots for all configured pages
 */
async function captureScreenshots(type = 'baseline') {
  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors'] // For local HTTPS
  });
  
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  const { baselineDir, comparisonDir } = setupDirectories();
  const outputDir = type === 'baseline' ? baselineDir : comparisonDir;
  
  console.log(`\n🎬 Capturing ${type} screenshots...`);
  console.log(`📁 Output directory: ${outputDir}\n`);
  
  for (const pageConfig of CONFIG.pages) {
    const url = `${CONFIG.baseUrl}/${CONFIG.bookSlug}${pageConfig.path}`;
    
    try {
      console.log(`📸 ${pageConfig.name} - ${pageConfig.description}`);
      console.log(`   URL: ${url}`);
      
      // Navigate and wait for content
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for fonts to load
      await page.waitForTimeout(1000);
      
      // Full page screenshot
      const screenshotPath = path.join(outputDir, `${pageConfig.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      console.log(`   ✅ Saved: ${screenshotPath}\n`);
      
    } catch (error) {
      console.error(`   ❌ Error capturing ${pageConfig.name}:`);
      console.error(`      ${error.message}\n`);
    }
  }
  
  await browser.close();
  console.log(`✨ ${type} screenshots captured!\n`);
}

/**
 * Capture element-specific screenshots with DevTools
 */
async function captureWithDevTools() {
  const browser = await chromium.launch({
    headless: false, // Show browser for manual DevTools inspection
    args: ['--ignore-certificate-errors']
  });
  
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  const url = `${CONFIG.baseUrl}/${CONFIG.bookSlug}/chapter/sample-chapter/`;
  
  console.log('\n🔍 Opening browser for manual DevTools inspection...');
  console.log(`   URL: ${url}`);
  console.log('\n   INSTRUCTIONS:');
  console.log('   1. Open DevTools (F12)');
  console.log('   2. Go to Elements tab');
  console.log('   3. Select the <html> or <body> element');
  console.log('   4. Look for :root CSS variables in Styles panel');
  console.log('   5. Take manual screenshots as needed');
  console.log('   6. Close browser when done\n');
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
  
  await browser.close();
}

/**
 * Capture specific components
 */
async function captureComponents() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  const url = `${CONFIG.baseUrl}/${CONFIG.bookSlug}/chapter/sample-chapter/`;
  const { baselineDir } = setupDirectories();
  
  console.log('\n🎯 Capturing component-specific screenshots...\n');
  
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Capture specific elements
  const components = [
    { selector: 'h1.entry-title', name: 'h1-heading' },
    { selector: 'h2', name: 'h2-heading' },
    { selector: 'h3', name: 'h3-heading' },
    { selector: 'p', name: 'paragraph' },
    { selector: 'blockquote', name: 'blockquote' },
    { selector: 'ul', name: 'list-unordered' },
    { selector: 'ol', name: 'list-ordered' },
    { selector: 'table', name: 'table' }
  ];
  
  for (const component of components) {
    try {
      const element = await page.$(component.selector);
      if (element) {
        const screenshotPath = path.join(baselineDir, `component-${component.name}.png`);
        await element.screenshot({ path: screenshotPath });
        console.log(`   ✅ ${component.name}: ${screenshotPath}`);
      } else {
        console.log(`   ⚠️  ${component.name}: Element not found`);
      }
    } catch (error) {
      console.log(`   ❌ ${component.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✨ Component screenshots captured!\n');
}

// Main execution
(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || 'baseline';
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   Buckram CSS Custom Properties - Screenshot Capture Tool     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  if (mode === 'devtools') {
    await captureWithDevTools();
  } else if (mode === 'components') {
    await captureComponents();
  } else if (mode === 'comparison') {
    await captureScreenshots('comparison');
  } else {
    await captureScreenshots('baseline');
  }
  
  console.log('📊 Next steps:');
  console.log('   1. Review baseline screenshots');
  console.log('   2. Activate CSS custom properties in mu-plugin');
  console.log('   3. Run: node capture-baseline.js comparison');
  console.log('   4. Compare baseline vs comparison screenshots');
  console.log('   5. Set up automated Playwright tests for CI\n');
})();
