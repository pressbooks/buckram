# Testing the Phase 1 POC

## Quick Start

### Option 1: Simple HTTP Server (Recommended)

Open a terminal in `buckram/assets/styles/` and run:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open: http://localhost:8000/test.html

### Option 2: Open Directly in Browser

1. Navigate to `buckram/assets/styles/test.html`
2. Right-click → Open with Browser
3. The CSS files should load via relative paths

**Note:** Some browsers may block local file loading. Use Option 1 if you see CORS errors.

## What to Test

### 1. Visual Inspection
- ✅ Headings should display with different styles (H1 centered, H2-H6 left-aligned)
- ✅ Colors should be visible (#373d3f dark gray)
- ✅ Theme override section should show red H1 and green H2

### 2. Browser DevTools
Open DevTools (F12) and:

1. **Inspect an H1 element:**
   - Computed styles should show: `color: rgb(55, 61, 63)` 
   - Styles panel should show: `color: var(--h1-color)`
   - Click through to see: `--h1-color: var(--custom-h1-color, #373d3f)`

2. **Test Override Mechanism:**
   - In DevTools, select the `:root` element
   - Add new rule: `--custom-h1-color: blue;`
   - H1 should turn blue instantly
   - This proves the override mechanism works!

3. **Check Computed Values:**
   - Filter Computed styles by "h1"
   - Should see all `--h1-*` properties
   - Values should match defaults or overrides

### 3. Modify and Reload
Edit `buckram-variables.css` and change a default:

```css
/* Change this: */
--h1-color: var(--custom-h1-color, #373d3f);

/* To this: */
--h1-color: var(--custom-h1-color, purple);
```

Reload browser - H1 should be purple (unless overridden).

## Expected Results

### Default Section (Test 1)
- H1: Dark gray (#373d3f), bold, centered, no transform
- H2: Dark gray (#373d3f), bold, left-aligned, no transform
- H3-H6: Similar with varying weights and styles

### Override Section (Test 2)
- H1: Red (#b01109), bold, centered, UPPERCASE
- H2: Green (#2c5f2d), bold, left-aligned, UPPERCASE  
- H3: Medium gray (#444), bold, left-aligned, no transform
- H4: Falls back to defaults

### Key Success Indicators
✅ CSS custom properties appear in DevTools  
✅ Override mechanism works (Test 2 shows different colors)  
✅ Fallback values work (defaults show when no override)  
✅ No JavaScript errors in console  
✅ All styles apply correctly  

## Troubleshooting

### CSS Not Loading
Check browser console for errors. File paths should be:
- `./buckram-variables.css`
- `./components/headings.css`

### Variables Not Working
- Check browser support (all modern browsers support CSS custom properties)
- IE11 does NOT support CSS custom properties (expected)

### Override Not Working
Check the specificity. Make sure override is on `:root` or higher specificity selector.

## Next Steps After Testing

Once visual test confirms everything works:

1. ✅ Commit these files to git
2. Add more variables (target: 90 total)
3. Convert body and blockquote components
4. Create context-specific files (web/epub/prince)
5. Test with McLuhan theme integration
