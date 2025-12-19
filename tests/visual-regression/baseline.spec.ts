/**
 * Baseline Visual Regression Tests
 * 
 * Compares SCSS baseline output with CSS custom properties output
 * to ensure visual parity across all components.
 */

import { test, expect } from '@playwright/test';
import { loadTestBook, components, viewports, type ComponentName } from './setup';

test.describe('Baseline Comparison - SCSS vs CSS Variables', () => {
  
  test.describe.configure({ mode: 'parallel' });

  // Test each component across all formats
  for (const component of components) {
    
    test.describe(`Component: ${component}`, () => {
      
      test('web format - baseline matches CSS variables', async ({ page }) => {
        await page.setViewportSize(viewports.web);
        
        // Load with SCSS baseline
        await loadTestBook(page, component, { format: 'web', useCSSVariables: false });
        const baseline = await page.screenshot({ fullPage: true });
        
        // Load with CSS variables
        await loadTestBook(page, component, { format: 'web', useCSSVariables: true });
        
        // Compare screenshots
        await expect(page).toHaveScreenshot(`${component}-web-baseline.png`, {
          maxDiffPixels: 100,
        });
      });

      test('epub format - baseline matches CSS variables', async ({ page }) => {
        await page.setViewportSize(viewports.epub);
        
        await loadTestBook(page, component, { format: 'epub', useCSSVariables: false });
        const baseline = await page.screenshot({ fullPage: true });
        
        await loadTestBook(page, component, { format: 'epub', useCSSVariables: true });
        
        await expect(page).toHaveScreenshot(`${component}-epub-baseline.png`, {
          maxDiffPixels: 100,
        });
      });

      test('prince format - baseline matches CSS variables', async ({ page }) => {
        await page.setViewportSize(viewports.prince);
        
        await loadTestBook(page, component, { format: 'prince', useCSSVariables: false });
        const baseline = await page.screenshot({ fullPage: true });
        
        await loadTestBook(page, component, { format: 'prince', useCSSVariables: true });
        
        await expect(page).toHaveScreenshot(`${component}-prince-baseline.png`, {
          maxDiffPixels: 100,
        });
      });
    });
  }
});

test.describe('Component-Specific Visual Tests', () => {
  
  test('typography - body text renders identically', async ({ page }) => {
    await loadTestBook(page, 'body', { format: 'web', useCSSVariables: true });
    
    const bodyText = page.locator('body, .entry-content');
    await expect(bodyText).toHaveScreenshot('body-text.png');
  });

  test('headings - all levels render identically', async ({ page }) => {
    await loadTestBook(page, 'headings', { format: 'web', useCSSVariables: true });
    
    for (let level = 1; level <= 6; level++) {
      const heading = page.locator(`h${level}`).first();
      await expect(heading).toHaveScreenshot(`heading-h${level}.png`);
    }
  });

  test('tables - complex table layouts match baseline', async ({ page }) => {
    await loadTestBook(page, 'tables', { format: 'web', useCSSVariables: true });
    
    const table = page.locator('table').first();
    await expect(table).toHaveScreenshot('table-complex.png');
  });

  test('section titles - chapter and part titles render correctly', async ({ page }) => {
    await loadTestBook(page, 'section-titles', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('.chapter-title').first()).toHaveScreenshot('chapter-title.png');
    await expect(page.locator('.part-title').first()).toHaveScreenshot('part-title.png');
  });

  test('title page - complete title page renders correctly', async ({ page }) => {
    await loadTestBook(page, 'title-page', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('#title-page')).toHaveScreenshot('title-page-full.png');
  });

  test('running headers - print headers render correctly', async ({ page }) => {
    await page.setViewportSize(viewports.prince);
    await loadTestBook(page, 'running-headers', { format: 'prince', useCSSVariables: true });
    
    await expect(page).toHaveScreenshot('running-headers-prince.png', {
      fullPage: true,
    });
  });

  test('textboxes - styled textboxes render identically', async ({ page }) => {
    await loadTestBook(page, 'textboxes', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('.textbox').first()).toHaveScreenshot('textbox-standard.png');
    await expect(page.locator('.textbox.shaded').first()).toHaveScreenshot('textbox-shaded.png');
  });

  test('pullquotes - pullquote positioning matches baseline', async ({ page }) => {
    await loadTestBook(page, 'pullquotes', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('.pullquote').first()).toHaveScreenshot('pullquote-standard.png');
    await expect(page.locator('.pullquote-left').first()).toHaveScreenshot('pullquote-left.png');
    await expect(page.locator('.pullquote-right').first()).toHaveScreenshot('pullquote-right.png');
  });

  test('footnotes - footnote references and content match', async ({ page }) => {
    await loadTestBook(page, 'footnotes', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('.footnote').first()).toHaveScreenshot('footnote.png');
  });

  test('toc - table of contents styling matches baseline', async ({ page }) => {
    await loadTestBook(page, 'toc', { format: 'web', useCSSVariables: true });
    
    await expect(page.locator('#toc')).toHaveScreenshot('toc-full.png');
  });
});
