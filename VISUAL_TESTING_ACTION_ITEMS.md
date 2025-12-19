# 🎬 Visual Regression Testing - Action Items

## ✅ Setup Complete

You now have Playwright-based screenshot capture ready to use!

## 📋 What's Been Created

```
buckram/
├── capture-baseline.js              # Screenshot capture script
├── VISUAL_TESTING_QUICKSTART.md     # Quick start guide
├── VISUAL_TESTING_SETUP.md          # Detailed setup docs
├── tests/screenshots/
│   ├── baseline/                    # SCSS-only screenshots (to capture)
│   ├── comparison/                  # CSS variables screenshots (to capture)
│   └── diff/                        # Automated diffs (future)
├── package.json                     # Added npm scripts:
│   ├── npm run capture:baseline
│   ├── npm run capture:comparison
│   ├── npm run capture:components
│   └── npm run capture:devtools
└── node_modules/
    ├── @playwright/test             # ✅ Installed
    └── playwright                   # ✅ Installed
```

## 🚀 Your Next Steps

### Step 1: Configure Your Test Book

Edit `capture-baseline.js` lines 17-20:

```javascript
const CONFIG = {
  baseUrl: 'https://pressbooks.test',  // Your Lando URL
  bookSlug: 'test-book',                // Change to your test book slug!
  screenshotDir: './tests/screenshots',
  // ...
};
```

**Find your book slug:**
```bash
# In browser, go to your Pressbooks network
# Navigate to "My Books"
# Click on a book
# URL will be: https://pressbooks.test/YOUR-BOOK-SLUG/
```

### Step 2: Ensure SCSS-Only Baseline

**Before capturing baseline, CSS variables must be OFF:**

1. Navigate to mu-plugin directory:
   ```bash
   cd C:\Users\steel\PhpstormProjects\setup-development-environment\web\app\mu-plugins
   ```

2. Temporarily disable the CSS variables mu-plugin:
   ```bash
   # Rename or move the file:
   mv buckram-css-props-test.php buckram-css-props-test.php.disabled
   ```

3. Clear Lando cache:
   ```bash
   cd C:\Users\steel\PhpstormProjects\setup-development-environment
   lando wp cache flush
   ```

4. Verify in browser that CSS variables are NOT present:
   - Open any chapter in your test book
   - Open DevTools (F12) → Elements tab
   - Select `<html>` or `<body>` element
   - In Styles panel, check `:root` section
   - **Should NOT see --h1-color, --h2-color, etc.**

### Step 3: Capture Baseline Screenshots

```bash
cd C:\Users\steel\PhpstormProjects\buckram
npm run capture:baseline
```

**Expected output:**
```
🎬 Capturing baseline screenshots...
📁 Output directory: ./tests/screenshots/baseline

📸 chapter-headings - Chapter with all heading levels (H1-H6)
   URL: https://pressbooks.test/test-book/chapter/sample-chapter/
   ✅ Saved: tests\screenshots\baseline\chapter-headings.png

📸 chapter-body-typography - Body text, paragraphs, line spacing
   ...
✨ baseline screenshots captured!
```

### Step 4: Review Baseline Screenshots

Open screenshots in:
```
tests\screenshots\baseline\
```

**Verify:**
- ✅ Pages rendered correctly
- ✅ All typography visible
- ✅ No console errors
- ✅ Content matches expectations

### Step 5: Enable CSS Custom Properties

1. Re-enable the mu-plugin:
   ```bash
   cd C:\Users\steel\PhpstormProjects\setup-development-environment\web\app\mu-plugins
   mv buckram-css-props-test.php.disabled buckram-css-props-test.php
   ```

2. Clear cache again:
   ```bash
   lando wp cache flush
   ```

3. Verify CSS variables ARE present:
   - Open chapter in browser
   - DevTools → Elements → `<html>` → `:root`
   - **Should see 270+ custom properties**
   - **H1 should be RED** (test override)
   - **H2 should be BLUE** (test override)

### Step 6: Capture Comparison Screenshots

```bash
cd C:\Users\steel\PhpstormProjects\buckram
npm run capture:comparison
```

Screenshots saved to: `tests\screenshots\comparison\`

### Step 7: Manual Comparison

**Side-by-side comparison tools:**

**Option A: Windows Photo Viewer**
```bash
# Open both files side by side
explorer tests\screenshots\baseline\chapter-headings.png
explorer tests\screenshots\comparison\chapter-headings.png
```

**Option B: Beyond Compare / WinMerge / Meld**
- Professional diff tools with image comparison
- Can overlay images to spot differences

**Option C: VS Code Image Preview Extension**
- Install: "Image Preview" extension
- Open both PNGs in tabs
- Toggle between them quickly

**What to look for:**

✅ **Acceptable (expected):**
- H1 is RED (test override working)
- H2 is BLUE (test override working)
- Body text 16pt (test override working)
- Minor anti-aliasing differences

❌ **Problems (investigate):**
- Text reflow / line breaking changes
- Spacing/margin differences
- Missing content
- Layout shifts
- Color changes (besides test overrides)

### Step 8: Document Findings

Create a test results document:

```markdown
# Visual Regression Test Results - [Date]

## Environment
- Buckram branch: feat/migrate-to-css-properties
- Pressbooks: [version]
- Browser: Chromium (Playwright)
- Book: [test book name]

## Test Results

| Component | Status | Notes |
|-----------|--------|-------|
| H1 Headings | ✅ PASS | RED color override visible |
| H2 Headings | ✅ PASS | BLUE color override visible |
| Body Typography | ✅ PASS | 16pt font size applied |
| Blockquotes | ✅ PASS / ❌ FAIL | ... |
| Lists | ✅ PASS / ❌ FAIL | ... |
| Tables | ✅ PASS / ❌ FAIL | ... |

## Issues Found
1. [Describe any visual differences]
2. ...

## Conclusion
- [ ] CSS custom properties working correctly
- [ ] No regressions detected
- [ ] Ready to continue variable conversion
```

## 🔄 Iteration Process

After fixing any issues:

1. Make changes to CSS variables
2. Clear cache: `lando wp cache flush`
3. Re-capture: `npm run capture:comparison`
4. Compare again
5. Repeat until perfect match

## 📚 Additional Resources

- **VISUAL_TESTING_QUICKSTART.md** - Quick reference
- **VISUAL_TESTING_SETUP.md** - Detailed setup guide  
- **TESTING_PLAN.md** - Comprehensive testing strategy
- **PHASE1_PROGRESS.md** - Variable conversion progress

## 🆘 Troubleshooting

### Screenshots are blank or error

Check:
```bash
# Is Lando running?
cd C:\Users\steel\PhpstormProjects\setup-development-environment
lando info

# Can you access book in browser?
# Open: https://pressbooks.test/your-book-slug/

# Does book have content?
```

### SSL certificate errors

Script already handles this, but if issues persist:
```javascript
// In capture-baseline.js, line 91:
args: ['--ignore-certificate-errors']  // Already set
```

### Wrong book/pages captured

Update config in `capture-baseline.js`:
```javascript
const CONFIG = {
  bookSlug: 'your-actual-book-slug',
  pages: [
    {
      name: 'your-chapter',
      path: '/chapter/your-chapter-slug/',
      description: 'Description'
    }
  ]
};
```

## ⏭️ Future: Automated Testing

Once manual comparison looks good:

1. **Set up pixelmatch comparison**
2. **Create Playwright test suite**
3. **Add to GitHub Actions CI**
4. **Automated pass/fail threshold**

See `TESTING_PLAN.md` for the full automation roadmap.

---

**Ready to start! 🚀**

```bash
# 1. Edit config
code capture-baseline.js

# 2. Disable CSS variables mu-plugin
# 3. Capture baseline
npm run capture:baseline

# 4. Enable CSS variables mu-plugin  
# 5. Capture comparison
npm run capture:comparison

# 6. Compare screenshots manually
```
