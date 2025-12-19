/**
 * Theme Override Tests
 * 
 * Tests that CSS custom properties can be overridden by themes
 * and produce expected visual results.
 */

import { test, expect } from '@playwright/test';
import { loadTestBook, testThemeOverride } from './setup';

test.describe('Theme Override Functionality', () => {
  
  test('can override body font family', async ({ page }) => {
    await loadTestBook(page, 'body', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'body-font-family': 'Georgia, serif'
      }
    });
    
    const computed = await page.locator('body').evaluate(
      el => window.getComputedStyle(el).fontFamily
    );
    
    expect(computed).toContain('Georgia');
  });

  test('can override body font size', async ({ page }) => {
    await loadTestBook(page, 'body', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'body-font-size': '18px'
      }
    });
    
    const computed = await page.locator('body').evaluate(
      el => window.getComputedStyle(el).fontSize
    );
    
    expect(computed).toBe('18px');
  });

  test('can override heading colors', async ({ page }) => {
    await loadTestBook(page, 'headings', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'h1-color': '#ff0000',
        'h2-color': '#00ff00',
        'h3-color': '#0000ff'
      }
    });
    
    const h1Color = await page.locator('h1').first().evaluate(
      el => window.getComputedStyle(el).color
    );
    const h2Color = await page.locator('h2').first().evaluate(
      el => window.getComputedStyle(el).color
    );
    
    expect(h1Color).toBe('rgb(255, 0, 0)');
    expect(h2Color).toBe('rgb(0, 255, 0)');
  });

  test('can override table styling', async ({ page }) => {
    await loadTestBook(page, 'tables', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'table-font-size': '0.85em',
        'table-border-width': '2px'
      }
    });
    
    await expect(page.locator('table').first()).toHaveScreenshot('table-custom-style.png');
  });

  test('can override textbox background color', async ({ page }) => {
    await loadTestBook(page, 'textboxes', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'textbox-background-color': '#f0f8ff',
        'textbox-border-color': '#4682b4'
      }
    });
    
    await expect(page.locator('.textbox').first()).toHaveScreenshot('textbox-custom-colors.png');
  });

  test('can override section title styling', async ({ page }) => {
    await loadTestBook(page, 'section-titles', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'chapter-title-font-size': '3em',
        'chapter-title-color': '#2c3e50',
        'chapter-title-text-transform': 'none'
      }
    });
    
    await expect(page.locator('.chapter-title').first()).toHaveScreenshot('chapter-title-custom.png');
  });

  test('can override paragraph indentation', async ({ page }) => {
    await loadTestBook(page, 'paragraphs', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'para-indent': '2em',
        'para-margin-bottom': '1.5em'
      }
    });
    
    await expect(page.locator('p + p').first()).toHaveScreenshot('paragraph-custom-indent.png');
  });

  test('can override link colors', async ({ page }) => {
    await loadTestBook(page, 'links', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'link-color': '#e74c3c'
      }
    });
    
    const linkColor = await page.locator('a').first().evaluate(
      el => window.getComputedStyle(el).color
    );
    
    expect(linkColor).toBe('rgb(231, 76, 60)');
  });

  test('can override running header styling', async ({ page }) => {
    await loadTestBook(page, 'running-headers', {
      format: 'prince',
      useCSSVariables: true,
      customProperties: {
        'runninghead-left-font-family': 'Arial, sans-serif',
        'runninghead-left-font-size': '0.8em',
        'runninghead-left-text-transform': 'none'
      }
    });
    
    await expect(page).toHaveScreenshot('running-header-custom.png', { fullPage: true });
  });

  test('can override page margins', async ({ page }) => {
    await page.setViewportSize({ width: 816, height: 1056 });
    
    await loadTestBook(page, 'body', {
      format: 'prince',
      useCSSVariables: true,
      customProperties: {
        'page-margin-top': '3cm',
        'page-margin-bottom': '3cm',
        'page-margin-inside': '2.5cm',
        'page-margin-outside': '2.5cm'
      }
    });
    
    await expect(page).toHaveScreenshot('page-custom-margins.png', { fullPage: true });
  });
});

test.describe('Theme Override Edge Cases', () => {
  
  test('multiple overrides work together', async ({ page }) => {
    await loadTestBook(page, 'body', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'body-font-family': 'Palatino, serif',
        'body-font-size': '16px',
        'body-line-height': '1.6',
        'h1-color': '#2c3e50',
        'h2-color': '#34495e',
        'para-indent': '1.5em'
      }
    });
    
    await expect(page).toHaveScreenshot('multiple-overrides.png', { fullPage: true });
  });

  test('inherit values work correctly', async ({ page }) => {
    await loadTestBook(page, 'headings', {
      format: 'web',
      useCSSVariables: true,
      customProperties: {
        'color-1': '#8e44ad',
        // h1-color, h2-color, etc. should inherit this
      }
    });
    
    await expect(page).toHaveScreenshot('inherited-colors.png');
  });

  test('format-specific values can be overridden', async ({ page }) => {
    // Test that overrides work for format-specific properties
    await loadTestBook(page, 'body', {
      format: 'prince',
      useCSSVariables: true,
      customProperties: {
        'body-font-size': '12pt' // Override prince-specific size
      }
    });
    
    const fontSize = await page.locator('body').evaluate(
      el => window.getComputedStyle(el).fontSize
    );
    
    expect(fontSize).toBe('12pt');
  });
});
