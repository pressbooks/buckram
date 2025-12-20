# Theme Options Migration to CSS Custom Properties

## Problem

Currently, Pressbooks theme options use `$styles->getSass()->setVariables()` to inject SCSS variables at runtime. This won't work with the CSS custom properties migration because:

1. **SCSS variables are compile-time**: They're replaced during SCSS compilation
2. **CSS custom properties are runtime**: They can be set dynamically via `<style>` tags
3. **Current pattern injects SCSS vars** into the compilation process, which Buckram no longer uses

## Current Pattern

**Location**: `pressbooks/inc/modules/themeoptions/`
- `class-ebookoptions.php`
- `class-pdfoptions.php`
- `class-weboptions.php`
- `class-globaloptions.php`

**Example (EbookOptions.php, line 541):**
```php
// Setting textbox colors
$styles->getSass()->setVariables([
    'examples-header-color' => $options['edu_textbox_examples_header_color'],
    'examples-header-background' => $options['edu_textbox_examples_header_background'],
    'learning-objectives-header-color' => $options['edu_textbox_objectives_header_color'],
]);
```

**Example (EbookOptions.php, line 587):**
```php
// Paragraph indentation
$styles->getSass()->setVariables([
    'para-margin-top' => '1em',
    'para-indent' => '0',
]);
```

**Example (EbookOptions.php, line 613):**
```php
// Shapeshifter fonts
$styles->getSass()->setVariables([
    'shapeshifter-font-2' => '"' . $ebook_header_font . '"',
    'shapeshifter-font-1' => '"' . $ebook_body_font . '"',
]);
```

## Required Solution

**New Pattern**: Generate CSS custom properties instead of SCSS variables

```php
// NEW: Generate CSS custom properties
$customProperties = $styles->generateCustomProperties([
    'examples-header-color' => $options['edu_textbox_examples_header_color'],
    'examples-header-background' => $options['edu_textbox_examples_header_background'],
]);

// Output: 
// :root {
//   --custom-examples-header-color: #value;
//   --custom-examples-header-background: #value;
// }
```

## Implementation Required

### 1. In Pressbooks Core (`inc/class-styles.php`)

Add new method to generate CSS custom properties:

```php
/**
 * Convert theme options to CSS custom properties
 * 
 * @param array $variables Buckram variable names and values
 * @return string CSS custom properties declaration
 */
public function generateCustomProperties( array $variables ): string {
    $props = [];
    
    foreach ( $variables as $name => $value ) {
        // Sanitize value
        $value = $this->sanitizeCssValue( $value );
        
        // Convert buckram variable name to CSS custom property
        // e.g., 'para-indent' becomes '--custom-para-indent'
        $props[] = sprintf( '  --custom-%s: %s;', $name, $value );
    }
    
    if ( empty( $props ) ) {
        return '';
    }
    
    return ":root {\n" . implode( "\n", $props ) . "\n}";
}

/**
 * Sanitize CSS value
 * 
 * @param mixed $value
 * @return string
 */
protected function sanitizeCssValue( $value ): string {
    if ( is_bool( $value ) ) {
        return $value ? 'true' : 'false';
    }
    
    if ( is_numeric( $value ) ) {
        return (string) $value;
    }
    
    // Escape and sanitize string values
    return esc_attr( $value );
}
```

### 2. In Theme Options Classes

**Replace ALL instances of:**
```php
$styles->getSass()->setVariables([
    'variable-name' => $value,
]);
```

**With:**
```php
$customCss .= $styles->generateCustomProperties([
    'variable-name' => $value,
]);
```

### 3. Variable Name Mapping

The CSS custom properties in `buckram-variables.css` use this pattern:
```css
--para-indent: var(--custom-para-indent, 1em);
```

So when theme options set `'para-indent' => '0'`, it needs to output:
```css
:root {
  --custom-para-indent: 0;
}
```

This will override the default value in Buckram.

## Files to Update

### Pressbooks Core
- [ ] `inc/class-styles.php` - Add `generateCustomProperties()` method
- [ ] `inc/modules/themeoptions/class-ebookoptions.php` - Replace ~12 setVariables() calls
- [ ] `inc/modules/themeoptions/class-pdfoptions.php` - Replace ~20 setVariables() calls
- [ ] `inc/modules/themeoptions/class-weboptions.php` - Replace ~10 setVariables() calls
- [ ] `inc/modules/themeoptions/class-globaloptions.php` - Check for setVariables() calls

### Testing Required
- [ ] Test ebook paragraph indentation options
- [ ] Test ebook textbox color customization
- [ ] Test PDF paragraph indentation
- [ ] Test PDF header/footer customization
- [ ] Test web font choices (Shapeshifter)
- [ ] Test chapter numbering enable/disable
- [ ] Test all other theme option features

## Backward Compatibility

### For Non-Buckram Themes
The new method should detect if the theme uses Buckram v2+ (CSS custom properties) or older versions (SCSS):

```php
public function applyThemeOptions( array $variables ): string {
    if ( $this->hasBuckram( '2.0.0' ) ) {
        // Use CSS custom properties for Buckram 2.0+
        return $this->generateCustomProperties( $variables );
    } else {
        // Fall back to SCSS variables for older themes
        $this->getSass()->setVariables( $variables );
        return '';
    }
}
```

## Migration Strategy

1. **Phase 1**: Add new `generateCustomProperties()` method to Styles class
2. **Phase 2**: Create wrapper method that detects Buckram version
3. **Phase 3**: Update all theme options classes to use wrapper method
4. **Phase 4**: Test extensively across all theme option combinations
5. **Phase 5**: Document changes for theme developers

## Priority

**HIGH** - This is blocking for the Buckram CSS migration to work in production. Without this, users won't be able to customize their books using theme options.

## Next Steps

1. Review this document with the team
2. Decide on exact implementation approach
3. Create implementation plan for Pressbooks core
4. Coordinate with Buckram migration timeline
