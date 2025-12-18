# Proof of Concept: Simple Variables Migration

## Goal
Demonstrate migration of simple SCSS variables to CSS custom properties as a POC.

## Example 1: Simple Color Variables

### Before (SCSS):
```scss
// variables/_colors.scss
$h1-color: $color-2 !default;
$h2-color: $color-2 !default;
$h3-color: $color-2 !default;
$h4-color: $color-3 !default;

// components/elements/_headings.scss
h1 { color: $h1-color; }
h2 { color: $h2-color; }
```

### After (CSS Custom Properties):
```css
/* variables/colors.css */
:root {
  /* Base colors */
  --color-1: #373d3f;
  --color-2: var(--color-1);
  --color-3: var(--color-1);
  
  /* Heading colors - with override capability */
  --h1-color: var(--custom-h1-color, var(--color-2));
  --h2-color: var(--custom-h2-color, var(--color-2));
  --h3-color: var(--custom-h3-color, var(--color-2));
  --h4-color: var(--custom-h4-color, var(--color-3));
}

/* components/elements/headings.css */
h1 { color: var(--h1-color); }
h2 { color: var(--h2-color); }
```

### Theme Override:
```css
/* In child theme */
:root {
  --custom-h1-color: #b01109; /* Override h1 color */
}
```

## Example 2: Font Properties

### Before (SCSS):
```scss
// variables/_elements.scss
$h1-font-style: normal !default;
$h1-font-weight: normal !default;
$h1-text-transform: uppercase !default;
$h1-text-align: center !default;

// components/elements/_headings.scss
h1 {
  font-style: $h1-font-style;
  font-weight: $h1-font-weight;
  text-transform: $h1-text-transform;
  text-align: $h1-text-align;
}
```

### After (CSS Custom Properties):
```css
/* variables/elements.css */
:root {
  --h1-font-style: var(--custom-h1-font-style, normal);
  --h1-font-weight: var(--custom-h1-font-weight, normal);
  --h1-text-transform: var(--custom-h1-text-transform, uppercase);
  --h1-text-align: var(--custom-h1-text-align, center);
}

/* components/elements/headings.css */
h1 {
  font-style: var(--h1-font-style);
  font-weight: var(--h1-font-weight);
  text-transform: var(--h1-text-transform);
  text-align: var(--h1-text-align);
}
```

## Example 3: Spacing Variables

### Before (SCSS):
```scss
// variables/_elements.scss
$hx-margin-top: 1.5em !default;
$hx-margin-bottom: 1em !default;
$hx-padding-bottom: 0 !default;

$h1-margin-top: $hx-margin-top !default;
$h1-margin-bottom: $hx-margin-bottom !default;
$h1-padding-bottom: $hx-padding-bottom !default;
```

### After (CSS Custom Properties):
```css
:root {
  /* Base spacing for all headings */
  --hx-margin-top: var(--custom-hx-margin-top, 1.5em);
  --hx-margin-bottom: var(--custom-hx-margin-bottom, 1em);
  --hx-padding-bottom: var(--custom-hx-padding-bottom, 0);
  
  /* H1-specific spacing (inherits from hx by default) */
  --h1-margin-top: var(--custom-h1-margin-top, var(--hx-margin-top));
  --h1-margin-bottom: var(--custom-h1-margin-bottom, var(--hx-margin-bottom));
  --h1-padding-bottom: var(--custom-h1-padding-bottom, var(--hx-padding-bottom));
}

h1 {
  margin-top: var(--h1-margin-top);
  margin-bottom: var(--h1-margin-bottom);
  padding-bottom: var(--h1-padding-bottom);
}
```

## Example 4: PHP Theme Options Integration

### Current SCSS Method:
```php
// In PDFOptions::scssOverrides()
$options = get_option('pressbooks_theme_options_pdf');

$styles->getSass()->setVariables([
    'h1-font-weight' => $options['pdf_h1_font_weight'] ?? 'bold',
]);

// SCSS compiled with this variable
```

### New CSS Custom Properties Method:
```php
// In Styles class - new method
public function optionsToCssProperties(array $options, string $prefix = 'pdf'): string {
    $css = ":root {\n";
    
    if (isset($options["{$prefix}_h1_font_weight"])) {
        $css .= "  --custom-h1-font-weight: {$options["{$prefix}_h1_font_weight"]};\n";
    }
    
    $css .= "}\n";
    return $css;
}

// Usage in export
$baseCSS = file_get_contents('buckram-prince.css');
$customCSS = $styles->optionsToCssProperties(
    get_option('pressbooks_theme_options_pdf'),
    'pdf'
);
$finalCSS = $baseCSS . "\n" . $customCSS;
```

## Variables to Migrate First (Simple Ones)

### From `variables/_elements.scss`:
- ✅ `$h1-font-style` through `$h6-font-style`
- ✅ `$h1-font-weight` through `$h6-font-weight`
- ✅ `$h1-text-transform` through `$h6-text-transform`
- ✅ `$h1-text-align` through `$h6-text-align`
- ✅ `$hx-border-bottom-style` (simple string)
- ✅ `$hx-letter-spacing` (when not using map)

### From `variables/_colors.scss`:
- ✅ `$h1-color` through `$h6-color`
- ✅ `$blockquote-color`
- ✅ `$table-color`
- ✅ `$shade-color-1`
- ✅ `$line-color-1`

### From `variables/_structure.scss`:
- ✅ `$left-running-separator` (string)
- ✅ `$right-running-separator` (string)
- ✅ Position strings where they're simple keywords

## Variables to Defer (Complex Ones)

### Requires Context Handling:
- ❌ `$body-font-size: (epub: medium, prince: 11pt, web: 14pt)`
- ❌ `$body-line-height: (epub: 1.4em, prince: 1.4em, web: 1.8em)`
- ❌ Any variable using maps for epub/prince/web contexts

### Requires Special Processing:
- ❌ `$link-color: (prince: normal, web: var(--primary, #b01109))`
- ❌ Position calculations using functions
- ❌ Variables that depend on `$type` variable

## Testing the POC

### 1. Create Test Files:
```bash
mkdir -p buckram/poc
```

### 2. Convert Simple Variables:
Create `buckram/poc/variables-simple.css` with basic custom properties

### 3. Convert One Component:
Convert `components/elements/headings.scss` → `poc/headings.css`

### 4. Test in Theme:
```css
/* In test theme */
@import 'buckram/poc/variables-simple.css';
@import 'buckram/poc/headings.css';

/* Override */
:root {
  --custom-h1-color: #b01109;
  --custom-h1-font-weight: bold;
}
```

### 5. Visual Comparison:
- Generate PDF with current SCSS system
- Generate PDF with CSS custom properties
- Compare visually

## Benefits Demonstrated

1. **No Runtime Compilation**: CSS is pre-compiled, just needs concatenation
2. **Clearer Override Mechanism**: `--custom-*` prefix makes overrides explicit
3. **Better Performance**: No SCSSPHP parsing at runtime
4. **Simpler Debugging**: Inspector shows computed custom property values
5. **Standard CSS**: No proprietary syntax

## Next Steps After POC

1. If POC successful, create actual branch in Buckram
2. Migrate all simple variables using this pattern
3. Document the pattern for theme developers
4. Move to Phase 2: Context-based variables
