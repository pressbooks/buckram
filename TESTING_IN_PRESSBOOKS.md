# Testing CSS Custom Properties in Pressbooks-Book

## ✅ Setup Complete!

The following setup has been completed:

1. **✅ Buckram Symlink Created:**
   - `pressbooks-book/packages/buckram` → `c:\Users\steel\PhpstormProjects\buckram`
   - Your local Buckram development version is now linked

2. **✅ Test Plugin Created:**
   - Location: `web/app/plugins/buckram-css-props-test.php`
   - Auto-loads CSS custom properties for webbooks
   - Shows admin notice with testing instructions

## Quick Start Testing

### Step 1: Activate Test Plugin

```bash
cd c:\Users\steel\PhpstormProjects\setup-development-environment
lando wp plugin activate buckram-css-props-test
```

**Or manually:**
- Go to Network Admin → Plugins
- Activate "Buckram CSS Custom Properties Test"

### Step 2: View a Book

- Open any existing book (or create one)
- View any chapter in the webbook
- **Expected Result:** H1 should be RED and UPPERCASE (test override active)

## Step-by-Step Testing

### Test 1: Verify CSS Custom Properties Load

1. **Open any chapter** in your browser
2. **View Page Source** (Ctrl+U)
3. **Search for:** `buckram-css-vars-test` or `buckram-variables.css`
4. **Expected:** Should find `<link>` tags loading the CSS custom properties

### Test 2: Inspect with DevTools

1. **Open DevTools** (F12)
2. **Inspect an H1 element**
3. **Styles panel should show:**
   ```css
   h1 {
       color: var(--h1-color);
       text-transform: var(--h1-text-transform);
       font-weight: var(--h1-font-weight);
       text-align: var(--h1-align);
   }
   ```
4. **Click through to see:**
   ```css
   :root {
       --h1-color: var(--custom-h1-color, #373d3f);
       --h1-text-transform: var(--custom-h1-text-transform, none);
   }
   ```
5. **And the test override:**
   ```css
   :root {
       --custom-h1-color: #b01109;
       --custom-h1-text-transform: uppercase;
   }
   ```

### Test 3: Verify Default Behavior

**Disable the test plugin** temporarily:
```bash
lando wp plugin deactivate buckram-css-props-test
```

- Refresh the page
- H1 should go back to normal (dark gray, not uppercase)
- This confirms the SCSS version still works

**Re-enable:**
```bash
lando wp plugin activate buckram-css-props-test
```

### Test 4: Custom Styles Override

1. **Go to:** Appearance → Custom Styles
2. **Click:** Web tab
3. **Add this CSS:**
   ```css
   :root {
       --custom-h2-color: green;
       --custom-h3-font-style: italic;
       --custom-h4-text-transform: uppercase;
   }
   ```
4. **Click:** Save
5. **Refresh your chapter**
6. **Verify:**
   - H2 is now green
   - H3 is italic
   - H4 is uppercase

### Test 5: Browser Support

Test in multiple browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (if available)

All modern browsers support CSS custom properties.

### Test 6: Performance Check

1. **Open DevTools → Network tab**
2. **Reload page**
3. **Check timing for:**
   - `buckram-variables.css` - should be < 10ms
   - No SCSS compilation happening
4. **Compare to:**
   - Traditional SCSS approach (first load ~190ms)
   - CSS custom properties (< 10ms)

## Expected Results

✅ **Working:**
- Headings render with CSS custom properties
- Override mechanism works
- DevTools show `var(--property-name)`
- No SCSS compilation needed for these variables

⚠️ **Not Yet Working:**
- Font sizes (need context-specific files)
- Margins with context maps (Phase 2)
- PDF export (need context handling)

## Cleanup

When testing is complete, restore original Buckram:

```bash
cd c:\Users\steel\PhpstormProjects\setup-development-environment\web\app\themes\pressbooks-book
rm packages\buckram  # Remove symlink
npm install  # Reinstalls buckram from npm
npm run build
```

## Integration Path Forward

Once POC is validated:

1. **Buckram:** Complete Phase 1 (90 variables)
2. **Buckram:** Create context files (web/epub/prince)
3. **Pressbooks Plugin:** Add `optionsToCssProperties()` method
4. **Pressbooks-Book:** Update to reference new CSS files
5. **Theme Options:** Convert to inject CSS variables instead of SCSS
6. **Export:** Update PDF/EPUB to use CSS custom properties
