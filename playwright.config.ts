import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Buckram CSS Variables Testing
 * 
 * This suite tests visual regression for the CSS custom properties migration,
 * comparing SCSS baseline output with CSS variables output.
 */
export default defineConfig({
  testDir: './tests/visual-regression',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. */
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL for test pages */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and formats */
  projects: [
    {
      name: 'web-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'web-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'web-webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'web-mobile',
      use: { 
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'web-tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },
    // PDF/Prince testing requires special setup
    {
      name: 'prince-pdf',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 816, height: 1056 }, // 8.5x11 inch at 96dpi
      },
      testMatch: /.*prince.*\.spec\.ts/,
    },
  ],

  /* Web server for test HTML files */
  webServer: {
    command: 'npm run serve:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  /* Visual regression specific settings */
  expect: {
    toHaveScreenshot: {
      /* Maximum pixel difference threshold */
      maxDiffPixels: 100,
      
      /* Maximum percentage of pixels that can differ */
      maxDiffPixelRatio: 0.01,
      
      /* Threshold for considering pixels as different (0-1) */
      threshold: 0.2,
      
      /* Animations should be disabled */
      animations: 'disabled',
    },
  },
});
