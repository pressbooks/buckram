/**
 * Test Setup and Utilities for Buckram Visual Regression Tests
 */

import { Page } from '@playwright/test';

export interface TestBookOptions {
  format: 'web' | 'epub' | 'prince';
  useCSSVariables: boolean;
  theme?: string;
  customProperties?: Record<string, string>;
}

/**
 * Load a test book page with specified options
 */
export async function loadTestBook(
  page: Page,
  component: string,
  options: TestBookOptions
): Promise<void> {
  const params = new URLSearchParams({
    format: options.format,
    cssVars: options.useCSSVariables.toString(),
    component,
    ...(options.theme && { theme: options.theme }),
  });

  await page.goto(`/test-pages/${component}.html?${params}`);
  
  // Wait for styles to load
  await page.waitForLoadState('networkidle');
  
  // Apply custom CSS properties if provided
  if (options.customProperties) {
    await applyCustomProperties(page, options.customProperties);
  }
  
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  
  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}

/**
 * Apply custom CSS properties to the page
 */
async function applyCustomProperties(
  page: Page,
  properties: Record<string, string>
): Promise<void> {
  const cssVars = Object.entries(properties)
    .map(([key, value]) => `--custom-${key}: ${value};`)
    .join('\n    ');

  await page.addStyleTag({
    content: `:root {\n    ${cssVars}\n  }`
  });
}

/**
 * Take a screenshot of a specific book element
 */
export async function screenshotElement(
  page: Page,
  selector: string,
  name: string
): Promise<Buffer> {
  const element = await page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return await element.screenshot({ path: `test-results/screenshots/${name}.png` });
}

/**
 * Compare baseline (SCSS) vs CSS variables output
 */
export async function compareBaselineVsCSS(
  page: Page,
  component: string,
  format: 'web' | 'epub' | 'prince',
  selector?: string
): Promise<{ baseline: Buffer; cssVars: Buffer }> {
  // Load baseline (SCSS) version
  await loadTestBook(page, component, { format, useCSSVariables: false });
  const baseline = selector 
    ? await page.locator(selector).screenshot()
    : await page.screenshot({ fullPage: true });
  
  // Load CSS variables version
  await loadTestBook(page, component, { format, useCSSVariables: true });
  const cssVars = selector
    ? await page.locator(selector).screenshot()
    : await page.screenshot({ fullPage: true });
  
  return { baseline, cssVars };
}

/**
 * Test theme override functionality
 */
export async function testThemeOverride(
  page: Page,
  component: string,
  property: string,
  value: string
): Promise<void> {
  await loadTestBook(page, component, {
    format: 'web',
    useCSSVariables: true,
    customProperties: { [property]: value }
  });
}

/**
 * Capture baseline screenshots for all components
 */
export const components = [
  'body',
  'headings',
  'paragraphs',
  'blockquotes',
  'lists',
  'tables',
  'links',
  'images',
  'footnotes',
  'section-titles',
  'title-page',
  'toc',
  'running-headers',
  'textboxes',
  'pullquotes',
  'columns',
  'code-blocks',
] as const;

export type ComponentName = typeof components[number];

/**
 * Format-specific viewport sizes
 */
export const viewports = {
  web: { width: 1024, height: 768 },
  epub: { width: 600, height: 800 },
  prince: { width: 816, height: 1056 }, // 8.5x11 at 96dpi
} as const;
