<?php
/**
 * CSS Custom Properties Integration Examples
 * 
 * This file contains example code for integrating CSS custom properties
 * into the Pressbooks core plugin. These are NOT meant to be run directly,
 * but serve as implementation guides for the actual migration.
 */

namespace Pressbooks\Examples;

/**
 * Example 1: New method in Styles class
 * Location: inc/class-styles.php
 */
class StylesExample {
    
    /**
     * Convert theme options array to CSS custom property declarations
     * 
     * @param array $options Theme options array (e.g., from get_option())
     * @param string $prefix Optional prefix to strip from keys (e.g., 'pdf_')
     * @param string $context Context for variable selection ('web', 'epub', 'prince')
     * @return string CSS custom property declarations wrapped in :root selector
     * 
     * @example
     * $options = [
     *     'pdf_h1_font_weight' => 'bold',
     *     'pdf_body_line_height' => '1.6em',
     * ];
     * $css = $styles->optionsToCssProperties($options, 'pdf_');
     * // Returns: ":root {\n  --custom-h1-font-weight: bold;\n  --custom-body-line-height: 1.6em;\n}\n"
     */
    public function optionsToCssProperties(array $options, string $prefix = '', string $context = 'web'): string {
        if (empty($options)) {
            return '';
        }
        
        $css = ":root {\n";
        
        foreach ($options as $key => $value) {
            // Skip empty values
            if ($value === '' || $value === null) {
                continue;
            }
            
            // Strip prefix if provided
            if ($prefix && str_starts_with($key, $prefix)) {
                $key = substr($key, strlen($prefix));
            }
            
            // Convert snake_case to kebab-case
            $cssVar = str_replace('_', '-', $key);
            
            // Sanitize value based on type
            $sanitizedValue = $this->sanitizeCssValue($value, $key);
            
            $css .= "  --custom-{$cssVar}: {$sanitizedValue};\n";
        }
        
        $css .= "}\n";
        
        /**
         * Filter the generated CSS custom properties
         * 
         * @param string $css The generated CSS
         * @param array $options The original options array
         * @param string $prefix The prefix that was stripped
         * @param string $context The context (web/epub/prince)
         */
        return apply_filters('pb_css_custom_properties', $css, $options, $prefix, $context);
    }
    
    /**
     * Sanitize a CSS value based on the option key
     * 
     * @param mixed $value The value to sanitize
     * @param string $key The option key (for context)
     * @return string The sanitized CSS value
     */
    protected function sanitizeCssValue($value, string $key = ''): string {
        // Boolean values
        if (is_bool($value)) {
            return $value ? 'block' : 'none';
        }
        
        // Numeric values - ensure proper units
        if (is_numeric($value)) {
            // Check if this is a unitless number that needs a unit
            if (strpos($key, 'opacity') !== false || strpos($key, 'weight') !== false) {
                return (string) $value; // Unitless values
            }
            // For dimensions, ensure px/em/pt unit
            return $value . 'px'; // Default to px, adjust as needed
        }
        
        // String values
        if (is_string($value)) {
            // Remove potentially dangerous characters
            $value = strip_tags($value);
            
            // Handle color values
            if ($this->isColorValue($value)) {
                return $this->sanitizeColor($value);
            }
            
            // Handle font families (may need quotes)
            if (strpos($key, 'font_family') !== false || strpos($key, 'font-family') !== false) {
                return $this->sanitizeFontFamily($value);
            }
            
            // Escape quotes in string values
            $value = str_replace('"', '\\"', $value);
            
            return $value;
        }
        
        return '';
    }
    
    /**
     * Check if a value looks like a color
     */
    protected function isColorValue(string $value): bool {
        return (
            strpos($value, '#') === 0 ||  // Hex colors
            strpos($value, 'rgb') === 0 || // RGB/RGBA
            strpos($value, 'hsl') === 0 || // HSL/HSLA
            in_array($value, ['transparent', 'currentColor', 'inherit', 'initial']) // Keywords
        );
    }
    
    /**
     * Sanitize color value
     */
    protected function sanitizeColor(string $color): string {
        // Basic hex color validation
        if (strpos($color, '#') === 0) {
            if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
                return $color;
            }
        }
        
        // RGB/RGBA validation
        if (preg_match('/^rgba?\([^)]+\)$/', $color)) {
            return $color;
        }
        
        // HSL/HSLA validation
        if (preg_match('/^hsla?\([^)]+\)$/', $color)) {
            return $color;
        }
        
        // Color keywords
        $validKeywords = ['transparent', 'currentColor', 'inherit', 'initial', 'unset'];
        if (in_array($color, $validKeywords)) {
            return $color;
        }
        
        // Invalid color, return safe default
        return 'inherit';
    }
    
    /**
     * Sanitize font family, ensuring proper quoting
     */
    protected function sanitizeFontFamily(string $font): string {
        $font = strip_tags($font);
        
        // Already quoted
        if (preg_match('/^["\'].*["\']$/', $font)) {
            return $font;
        }
        
        // Contains spaces - needs quotes
        if (strpos($font, ' ') !== false) {
            return '"' . str_replace('"', '', $font) . '"';
        }
        
        return $font;
    }
}

/**
 * Example 2: Updated PDF Export
 * Location: inc/modules/export/prince/class-pdf.php
 */
class PDFExportExample {
    
    /**
     * Get styles for PDF export using CSS custom properties
     * 
     * @return string Complete CSS for PDF
     */
    protected function getStylesWithCustomProperties(): string {
        $styles = \Pressbooks\Container::get('Styles');
        
        // Load pre-compiled base CSS from Buckram
        $buckramCSS = $this->loadBuckramCSS('prince');
        
        // Load theme's base CSS (already compiled)
        $themeCSS = $this->loadThemeCSS('prince');
        
        // Generate custom property overrides from global options
        $globalOptions = get_option('pressbooks_theme_options_global');
        $globalCSS = $styles->optionsToCssProperties($globalOptions, '', 'prince');
        
        // Generate custom property overrides from PDF options
        $pdfOptions = get_option('pressbooks_theme_options_pdf');
        $pdfCSS = $styles->optionsToCssProperties($pdfOptions, 'pdf_', 'prince');
        
        // Get any user custom CSS
        $customCSS = $this->getCustomCss();
        
        // Apply filters for additional overrides
        $overrideCSS = $this->themeOptionsOverrides();
        
        // Combine all CSS in correct order
        $finalCSS = implode("\n\n", array_filter([
            $buckramCSS,
            $themeCSS,
            $globalCSS,
            $pdfCSS,
            $customCSS,
            $overrideCSS,
        ]));
        
        return $finalCSS;
    }
    
    /**
     * Load Buckram CSS for specific context
     */
    protected function loadBuckramCSS(string $context): string {
        // In development, load from node_modules or local path
        $buckramPath = WP_CONTENT_DIR . '/themes/pressbooks-book/packages/buckram/dist/';
        $filename = "buckram-{$context}.css";
        
        if (file_exists($buckramPath . $filename)) {
            return \Pressbooks\Utility\get_contents($buckramPath . $filename);
        }
        
        return '';
    }
    
    /**
     * Load theme CSS
     */
    protected function loadThemeCSS(string $context): string {
        $theme = wp_get_theme();
        $themePath = get_stylesheet_directory() . "/assets/styles/{$context}/style.css";
        
        if (file_exists($themePath)) {
            return \Pressbooks\Utility\get_contents($themePath);
        }
        
        return '';
    }
    
    /**
     * Theme options overrides now return CSS custom properties
     * instead of SCSS variables
     */
    protected function themeOptionsOverrides(): string {
        $css = '';
        
        // Copyright notice (example of direct CSS insertion)
        if (empty($GLOBALS['PB_SECRET_SAUCE']['TURN_OFF_FREEBIE_NOTICES_PDF'])) {
            $notice = __('This book was produced with Pressbooks (https://pressbooks.com) and rendered with Prince.', 'pressbooks');
            $css .= "#copyright-page .ugc > p:last-of-type::after { display:block; margin-top: 1em; content: '{$notice}' }\n";
        }
        
        /**
         * Filter CSS overrides for PDF export
         * 
         * @param string $css The CSS overrides
         */
        return apply_filters('pb_pdf_css_override', $css);
    }
}

/**
 * Example 3: Updated Theme Options Classes
 * Location: inc/modules/themeoptions/class-pdfoptions.php
 */
class PDFOptionsExample {
    
    /**
     * Generate CSS custom properties from PDF theme options
     * Replaces the old scssOverrides() method pattern
     * 
     * @return string CSS with custom property declarations
     */
    public static function cssOverrides(): string {
        $styles = \Pressbooks\Container::get('Styles');
        $css = '';
        
        // Global Options
        $globalOptions = get_option('pressbooks_theme_options_global');
        
        // Should we display chapter numbers?
        if (is_array($globalOptions) && !$globalOptions['chapter_numbers']) {
            $css .= ":root {\n";
            $css .= "  --custom-chapter-number-display: none;\n";
            $css .= "}\n";
        }
        
        // PDF Options
        $pdfOptions = get_option('pressbooks_theme_options_pdf');
        
        // Map PDF options to CSS custom properties
        $optionMapping = [
            'pdf_body_font_family' => 'body-font-family',
            'pdf_body_font_size' => 'body-font-size',
            'pdf_body_line_height' => 'body-line-height',
            'pdf_page_width' => 'page-width',
            'pdf_page_height' => 'page-height',
            'pdf_page_margin_top' => 'page-margin-top',
            'pdf_page_margin_bottom' => 'page-margin-bottom',
            'pdf_page_margin_inside' => 'page-margin-inside',
            'pdf_page_margin_outside' => 'page-margin-outside',
            'pdf_hyphens' => 'hyphens',
            'pdf_paragraph_separation' => 'para-margin-bottom',
            // ... more mappings
        ];
        
        $customProps = [];
        foreach ($optionMapping as $optionKey => $cssVar) {
            if (isset($pdfOptions[$optionKey]) && $pdfOptions[$optionKey] !== '') {
                $value = $styles->sanitizeCssValue($pdfOptions[$optionKey], $optionKey);
                
                // Handle special cases
                if ($optionKey === 'pdf_hyphens') {
                    $value = $pdfOptions[$optionKey] ? 'auto' : 'none';
                }
                
                $customProps[] = "  --custom-{$cssVar}: {$value};";
            }
        }
        
        if (!empty($customProps)) {
            $css .= ":root {\n";
            $css .= implode("\n", $customProps) . "\n";
            $css .= "}\n";
        }
        
        // Special handling for running content
        if (!empty($pdfOptions['pdf_running_content_front_matter_left'])) {
            $content = self::replaceRunningContentTags($pdfOptions['pdf_running_content_front_matter_left']);
            $css .= "@page front-matter:left {\n";
            $css .= "  @top-left { content: string({$content}); }\n";
            $css .= "}\n";
        }
        
        /**
         * Filter PDF CSS overrides
         * 
         * @param string $css The generated CSS
         */
        return apply_filters('pb_pdf_css_overrides', $css);
    }
    
    /**
     * Helper to replace running content tags
     */
    public static function replaceRunningContentTags(string $content): string {
        $replacements = [
            '%book_title%' => 'book-title',
            '%book_subtitle%' => 'book-subtitle',
            '%book_author%' => 'book-author',
            '%section_title%' => 'section-title',
            '%section_author%' => 'section-author',
            '%section_subtitle%' => 'section-subtitle',
            '%blank%' => '""',
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $content);
    }
}

/**
 * Example 4: Web Options with CSS Custom Properties
 * Location: inc/modules/themeoptions/class-weboptions.php
 */
class WebOptionsExample {
    
    /**
     * Generate CSS custom properties for web display
     * 
     * @return string CSS with custom property declarations
     */
    public static function cssOverrides(): string {
        $styles = \Pressbooks\Container::get('Styles');
        $css = '';
        
        $options = get_option('pressbooks_theme_options_web');
        
        // Paragraph separation
        if (isset($options['paragraph_separation']) && $options['paragraph_separation'] === 'indent') {
            $css .= ":root {\n";
            $css .= "  --custom-para-margin-bottom: 0;\n";
            $css .= "  --custom-para-indent: 1em;\n";
            $css .= "}\n";
        }
        
        // Webbook fonts (Shapeshifter feature)
        if (!empty($options['webbook_header_font'])) {
            $font = str_replace('"', '', $options['webbook_header_font']);
            $css .= ":root {\n";
            $css .= "  --custom-font-2: \"{$font}\";\n";
            $css .= "}\n";
        }
        
        if (!empty($options['webbook_body_font'])) {
            $font = str_replace('"', '', $options['webbook_body_font']);
            $css .= ":root {\n";
            $css .= "  --custom-font-1: \"{$font}\";\n";
            $css .= "}\n";
        }
        
        // Textbox colors (educational textboxes)
        $textboxOptions = [
            'edu_textbox_examples_header_color' => 'examples-header-color',
            'edu_textbox_examples_header_background' => 'examples-header-background',
            'edu_textbox_examples_background' => 'examples-background',
            'edu_textbox_exercises_header_color' => 'exercises-header-color',
            'edu_textbox_exercises_header_background' => 'exercises-header-background',
            'edu_textbox_exercises_background' => 'exercises-background',
            'edu_textbox_objectives_header_color' => 'learning-objectives-header-color',
            'edu_textbox_objectives_header_background' => 'learning-objectives-header-background',
            'edu_textbox_objectives_background' => 'learning-objectives-background',
        ];
        
        $customProps = [];
        foreach ($textboxOptions as $optionKey => $cssVar) {
            if (isset($options[$optionKey]) && $options[$optionKey] !== '') {
                $value = $styles->sanitizeColor($options[$optionKey]);
                $customProps[] = "  --custom-{$cssVar}: {$value};";
            }
        }
        
        if (!empty($customProps)) {
            $css .= ":root {\n";
            $css .= implode("\n", $customProps) . "\n";
            $css .= "}\n";
        }
        
        return apply_filters('pb_web_css_overrides', $css);
    }
}

/**
 * Example 5: Compatibility Check
 * Add to Styles class
 */
class CompatibilityExample {
    
    /**
     * Check if current theme supports CSS custom properties
     * 
     * @return bool
     */
    public function supportsCssCustomProperties(): bool {
        $theme = wp_get_theme();
        
        // Check for explicit support declaration
        if ($theme->get('Supports_CSS_Custom_Properties')) {
            return true;
        }
        
        // Check theme version (assume themes v3.0+ support custom properties)
        $version = $theme->get('Version');
        if (version_compare($version, '3.0.0', '>=')) {
            return true;
        }
        
        // Check for presence of CSS custom property files
        $themePath = get_stylesheet_directory();
        if (file_exists($themePath . '/assets/styles/web/style.css') &&
            !file_exists($themePath . '/assets/styles/web/style.scss')) {
            // Has CSS but not SCSS - likely using custom properties
            return true;
        }
        
        return false;
    }
    
    /**
     * Get styles using appropriate method based on theme compatibility
     * 
     * @param string $type Context: 'web', 'epub', or 'prince'
     * @return string Complete CSS
     */
    public function getStyles(string $type): string {
        if ($this->supportsCssCustomProperties()) {
            return $this->getStylesWithCustomProperties($type);
        } else {
            return $this->getStylesWithScss($type);
        }
    }
    
    protected function getStylesWithCustomProperties(string $type): string {
        // New CSS custom properties method
        // Load pre-compiled CSS + inject custom properties
        // ...
    }
    
    protected function getStylesWithScss(string $type): string {
        // Legacy SCSS compilation method
        // Compile SCSS at runtime
        // ...
    }
}
