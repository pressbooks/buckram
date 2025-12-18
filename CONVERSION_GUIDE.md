# SCSS to CSS Custom Properties: Conversion Guide

## Quick Reference for Converting Variables

### Pattern 1: Simple Value with !default

**SCSS:**
```scss
$h1-font-weight: normal !default;
```

**CSS Custom Properties:**
```css
:root {
  --h1-font-weight: var(--custom-h1-font-weight, normal);
}
```

**Usage:**
```css
h1 {
  font-weight: var(--h1-font-weight);
}
```

**Override in child theme:**
```css
:root {
  --custom-h1-font-weight: bold;
}
```

### Pattern 2: Variable References Another Variable

**SCSS:**
```scss
$color-2: $color-1 !default;
$h1-color: $color-2 !default;
```

**CSS Custom Properties:**
```css
:root {
  --color-1: #373d3f;
  --color-2: var(--custom-color-2, var(--color-1));
  --h1-color: var(--custom-h1-color, var(--color-2));
}
```

### Pattern 3: Context-Based Maps (Complex - Phase 2)

**SCSS:**
```scss
$body-font-size: (
  epub: medium,
  prince: 11pt,
  web: 14pt
) !default;

// Usage with function
body {
  font-size: if-map-get($body-font-size, $type);
}
```

**CSS Custom Properties (Approach: Separate Files):**

`buckram-web.css`:
```css
:root {
  --body-font-size-base: 14pt;
  --body-font-size: var(--custom-body-font-size, var(--body-font-size-base));
}
```

`buckram-epub.css`:
```css
:root {
  --body-font-size-base: medium;
  --body-font-size: var(--custom-body-font-size, var(--body-font-size-base));
}
```

`buckram-prince.css`:
```css
:root {
  --body-font-size-base: 11pt;
  --body-font-size: var(--custom-body-font-size, var(--body-font-size-base));
}
```

`buckram-common.css`:
```css
body {
  font-size: var(--body-font-size);
}
```

## Naming Conventions

### For Base Variables
Use the same name as SCSS but with `--` prefix and kebab-case:
- `$h1-font-weight` → `--h1-font-weight`
- `$body_font_size` → `--body-font-size`

### For Override Variables
Add `--custom-` prefix:
- Override point: `--custom-h1-font-weight`
- Full declaration: `--h1-font-weight: var(--custom-h1-font-weight, bold);`

### For Context-Specific Base Values
Add context suffix to base:
- `--body-font-size-base` (in context-specific file)
- `--body-font-size` (final variable used in components)

## PHP Integration Patterns

### Current SCSS Pattern:
```php
$styles = Container::get('Styles');
$styles->getSass()->setVariables([
    'h1-font-weight' => 'bold',
    'body-line-height' => '1.6em',
]);
$css = $styles->customize('prince', $scss);
```

### New CSS Custom Properties Pattern:
```php
$styles = Container::get('Styles');
$customProps = $styles->optionsToCssProperties([
    'h1_font_weight' => 'bold',
    'body_line_height' => '1.6em',
]);
// $customProps = ":root { --custom-h1-font-weight: bold; --custom-body-line-height: 1.6em; }"

$baseCSS = file_get_contents('buckram-prince.css');
$finalCSS = $baseCSS . "\n" . $customProps;
```

### New Styles Method (to be implemented):
```php
/**
 * Convert theme options to CSS custom properties
 * 
 * @param array $options Key-value pairs of theme options
 * @param string $prefix Optional prefix to strip from keys (e.g., 'pdf_')
 * @return string CSS custom property declarations in :root selector
 */
public function optionsToCssProperties(array $options, string $prefix = ''): string {
    $css = ":root {\n";
    
    foreach ($options as $key => $value) {
        // Strip prefix if provided
        if ($prefix && str_starts_with($key, $prefix)) {
            $key = substr($key, strlen($prefix));
        }
        
        // Convert snake_case to kebab-case
        $cssVar = str_replace('_', '-', $key);
        
        // Sanitize value
        $value = $this->sanitizeCssValue($value);
        
        $css .= "  --custom-{$cssVar}: {$value};\n";
    }
    
    $css .= "}\n";
    return $css;
}
```

## Conversion Checklist

### ✅ Phase 1: Simple Variables (Ready to Convert)

#### From `_colors.scss`:
- [x] `$h1-color` through `$h6-color`
- [x] `$body-color`
- [x] `$blockquote-color`
- [x] `$table-color`
- [x] `$shade-color-1`
- [x] `$line-color-1`
- [ ] `$link-color-print`

#### From `_elements.scss` (non-map values):
- [x] `$h1-font-style` through `$h6-font-style`
- [x] `$h1-font-weight` through `$h6-font-weight`
- [x] `$h1-text-transform` through `$h6-text-transform`
- [x] `$h1-text-align` through `$h6-text-align`
- [x] `$hx-margin-top`, `$hx-margin-bottom`, `$hx-padding-bottom`
- [x] `$hx-border-bottom-style`
- [x] Heading-specific margins, paddings
- [x] Paragraph margins, indents
- [x] Blockquote dimensions and spacing

#### From `_structure.scss`:
- [x] `$left-running-separator`
- [x] `$right-running-separator`
- [ ] Position keywords (where simple strings)

### ⏸️ Phase 2: Context-Based Variables (Needs Strategy)

- [ ] `$body-font-size` (map)
- [ ] `$body-line-height` (map)
- [ ] `$h1-font-size` through `$h6-font-size` (most are maps)
- [ ] `$link-color` (map with web fallback)
- [ ] `$hx-letter-spacing` (map)
- [ ] `$hx-word-spacing` (map)
- [ ] All variables using `if-map-get()`

### 🔧 Phase 3: Complex Processing (Needs Custom Handling)

- [ ] Position calculation functions
- [ ] Running content string interpolation
- [ ] Font family conditionals (serif detection)
- [ ] Complex border properties (style + width + color)

## Testing Checklist

For each converted variable:
- [ ] Default value renders correctly
- [ ] Theme override works
- [ ] PHP theme options injection works
- [ ] Exports (PDF/EPUB) render correctly
- [ ] Web version renders correctly
- [ ] Visual regression test passes

## File Organization

```
buckram/
├── assets/styles/
│   ├── variables/
│   │   └── _variables.scss         # Source of truth (for now)
│   └── components/
│       └── ...                      # Component styles
├── dist/                            # Build output
│   ├── buckram-web.css
│   ├── buckram-epub.css
│   ├── buckram-prince.css
│   └── buckram-common.css
├── poc/                             # Proof of concept files
│   ├── buckram-variables-simple.css
│   └── test-theme-override.css
└── CSS_CUSTOM_PROPERTIES_MIGRATION.md
```

## Common Pitfalls

### 1. Forgetting the `var()` function
❌ Wrong:
```css
h1 { color: --h1-color; }
```

✅ Correct:
```css
h1 { color: var(--h1-color); }
```

### 2. Not providing fallbacks
❌ Fragile:
```css
:root {
  --h1-color: var(--custom-h1-color);  /* No fallback if --custom-h1-color not set */
}
```

✅ Robust:
```css
:root {
  --h1-color: var(--custom-h1-color, var(--color-2));
}
```

### 3. Circular references
❌ Will fail:
```css
:root {
  --color-1: var(--color-2);
  --color-2: var(--color-1);
}
```

### 4. Invalid custom property names
❌ Wrong:
```css
--1st-color: #fff;      /* Can't start with number */
--$color: #fff;          /* Can't use $ */
```

✅ Correct:
```css
--first-color: #fff;
--color: #fff;
```

## Migration Order

1. Start with colors (most straightforward)
2. Move to simple typography (font-style, font-weight, text-transform)
3. Then spacing (margins, padding)
4. Then borders
5. Save context-based values for Phase 2
6. Save complex functions for Phase 3

## Resources

- [CSS Custom Properties Spec](https://www.w3.org/TR/css-variables/)
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [PrinceXML CSS Variables Support](https://www.princexml.com/doc/css-variables/)
- Buckram Documentation: https://buckram.pressbooks.org/
