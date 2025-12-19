/**
 * Regression Tests for Specific Issues
 * 
 * Tests for known edge cases, bugs, and specific scenarios
 * that need verification after CSS variables migration.
 */

import { test, expect } from '@playwright/test';
import { loadTestBook } from './setup';

test.describe('Regression Tests - Known Issues', () => {
  
  test('widows and orphans control works correctly', async ({ page }) => {
    await loadTestBook(page, 'paragraphs', {
      format: 'prince',
      useCSSVariables: true
    });
    
    // Verify widows/orphans CSS properties are applied
    const widows = await page.locator('p').first().evaluate(
      el => window.getComputedStyle(el).widows
    );
    const orphans = await page.locator('p').first().evaluate(
      el => window.getComputedStyle(el).orphans
    );
    
    expect(widows).toBe('2');
    expect(orphans).toBe('1');
  });

  test('hyphenation settings apply correctly', async ({ page }) => {
    await loadTestBook(page, 'paragraphs', {
      format: 'prince',
      useCSSVariables: true
    });
    
    const hyphens = await page.locator('p').first().evaluate(
      el => window.getComputedStyle(el).hyphens
    );
    
    expect(hyphens).toBe('auto');
  });

  test('floated images with captions maintain layout', async ({ page }) => {
    await loadTestBook(page, 'images', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('.wp-caption.alignleft')).toHaveScreenshot('image-float-left.png');
    await expect(page.locator('.wp-caption.alignright')).toHaveScreenshot('image-float-right.png');
  });

  test('table border collapse works correctly', async ({ page }) => {
    await loadTestBook(page, 'tables', {
      format: 'web',
      useCSSVariables: true
    });
    
    const borderCollapse = await page.locator('table').first().evaluate(
      el => window.getComputedStyle(el).borderCollapse
    );
    
    expect(borderCollapse).toBe('collapse');
  });

  test('footnote markers maintain superscript positioning', async ({ page }) => {
    await loadTestBook(page, 'footnotes', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('.footnote').first()).toHaveScreenshot('footnote-marker.png');
  });

  test('running headers content strings render correctly', async ({ page }) => {
    await loadTestBook(page, 'running-headers', {
      format: 'prince',
      useCSSVariables: true
    });
    
    // Verify running content is present (prince-specific)
    await expect(page).toHaveScreenshot('running-content.png', { fullPage: true });
  });

  test('page break controls work in print', async ({ page }) => {
    await page.setViewportSize({ width: 816, height: 1056 });
    
    await loadTestBook(page, 'section-titles', {
      format: 'prince',
      useCSSVariables: true
    });
    
    // Verify page breaks before chapters
    await expect(page).toHaveScreenshot('page-breaks.png', { fullPage: true });
  });

  test('dropcap first-letter styling applies', async ({ page }) => {
    await loadTestBook(page, 'paragraphs', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('.first-character').first()).toHaveScreenshot('dropcap.png');
  });

  test('column layouts maintain proper spacing', async ({ page }) => {
    await loadTestBook(page, 'columns', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('.two-column').first()).toHaveScreenshot('columns-two.png');
    await expect(page.locator('.three-column').first()).toHaveScreenshot('columns-three.png');
  });

  test('textbox sidebars float correctly', async ({ page }) => {
    await loadTestBook(page, 'textboxes', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('.textbox--sidebar')).toHaveScreenshot('textbox-sidebar.png');
  });

  test('code blocks maintain monospace and no hyphenation', async ({ page }) => {
    await loadTestBook(page, 'code-blocks', {
      format: 'web',
      useCSSVariables: true
    });
    
    const fontFamily = await page.locator('code').first().evaluate(
      el => window.getComputedStyle(el).fontFamily
    );
    const hyphens = await page.locator('code').first().evaluate(
      el => window.getComputedStyle(el).hyphens
    );
    
    expect(fontFamily).toContain('monospace');
    expect(hyphens).toBe('none');
  });

  test('blockquote indentation maintains margins', async ({ page }) => {
    await loadTestBook(page, 'blockquotes', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('blockquote').first()).toHaveScreenshot('blockquote-margins.png');
  });

  test('list item spacing consistent', async ({ page }) => {
    await loadTestBook(page, 'lists', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('ul').first()).toHaveScreenshot('list-ul.png');
    await expect(page.locator('ol').first()).toHaveScreenshot('list-ol.png');
  });

  test('definition list styling maintains layout', async ({ page }) => {
    await loadTestBook(page, 'lists', {
      format: 'web',
      useCSSVariables: true
    });
    
    await expect(page.locator('dl').first()).toHaveScreenshot('definition-list.png');
  });

  test('epub-specific line-height inheritance works', async ({ page }) => {
    await loadTestBook(page, 'body', {
      format: 'epub',
      useCSSVariables: true
    });
    
    // Check that body * inherits line-height
    const lineHeight = await page.locator('body *').first().evaluate(
      el => window.getComputedStyle(el).lineHeight
    );
    
    expect(lineHeight).toBeTruthy();
  });
});

test.describe('Cross-Format Consistency', () => {
  
  test('body text renders consistently across formats', async ({ page, browser }) => {
    const formats = ['web', 'epub', 'prince'] as const;
    
    for (const format of formats) {
      await loadTestBook(page, 'body', {
        format,
        useCSSVariables: true
      });
      
      await expect(page).toHaveScreenshot(`body-${format}-consistency.png`, {
        fullPage: true,
      });
    }
  });

  test('headings maintain hierarchy across formats', async ({ page }) => {
    const formats = ['web', 'epub', 'prince'] as const;
    
    for (const format of formats) {
      await loadTestBook(page, 'headings', {
        format,
        useCSSVariables: true
      });
      
      // Get computed font sizes for all heading levels
      const sizes = await page.evaluate(() => {
        const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        return headings.map(tag => {
          const el = document.querySelector(tag);
          return el ? parseFloat(window.getComputedStyle(el).fontSize) : 0;
        });
      });
      
      // Verify hierarchy (each level should be smaller than previous)
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeLessThanOrEqual(sizes[i - 1]);
      }
    }
  });
});
