<?php
/**
 * Plugin Name: Buckram CSS Custom Properties Test
 * Description: POC test for Phase 1 CSS custom properties migration
 * Version: 1.0.0
 * Author: Pressbooks
 */

namespace PressbooksBuckramTest;

/**
 * Add CSS custom properties inline for webbooks
 * 
 * This is a POC test that layers CSS custom properties on top of existing SCSS.
 * The SCSS compilation still works normally, but we're adding CSS vars that will
 * eventually replace the SCSS variables.
 */
add_action('wp_head', function() {
    if (! \Pressbooks\Book::isBook()) {
        return;
    }
    
    ?>
    <style id="buckram-css-props-poc">
    /* Buckram CSS Custom Properties - Phase 1 POC */
    
    :root {
        /* Heading Colors - TEST VALUES */
        --h1-color: #b01109; /* TEST: Red for visibility */
        --h2-color: #b01109; /* TEST: Red for visibility */
        --h3-color: #373d3f;
        --h4-color: #373d3f;
        
        /* Heading Text Transform */
        --h1-text-transform: uppercase; /* TEST: Uppercase for visibility */
        --h2-text-transform: uppercase; /* TEST: Uppercase for visibility */
        --h3-text-transform: none;
        
        /* Heading Font Weight */
        --h1-font-weight: bold;
        --h2-font-weight: bold;
        --h3-font-weight: bold;
    }
    
    /* Override with high specificity to beat section.chapter header h1 */
    section.chapter header h1.entry-title,
    .chapter h1.entry-title,
    section header h1,
    h1.entry-title {
        color: var(--h1-color) !important;
        text-transform: var(--h1-text-transform) !important;
        font-weight: var(--h1-font-weight) !important;
    }
    
    section.chapter h2,
    .chapter h2,
    article h2,
    h2 {
        color: var(--h2-color) !important;
        text-transform: var(--h2-text-transform) !important;
        font-weight: var(--h2-font-weight) !important;
    }
    </style>
    <?php
}, 999); // Very late to override SCSS styles

/**
 * Add admin notice with testing instructions
 */
add_action('admin_notices', function() {
    if (! \Pressbooks\Book::isBook()) {
        return;
    }
    
    $screen = get_current_screen();
    if ($screen && in_array($screen->id, ['dashboard', 'toplevel_page_pb_organize'])) {
        ?>
        <div class="notice notice-info">
            <h3>🧪 Buckram CSS Custom Properties Test Active</h3>
            <p><strong>Testing Phase 1 POC:</strong> 62 simple variables converted to CSS custom properties.</p>
            <ul>
                <li>✅ Visit any chapter to see CSS custom properties in action</li>
                <li>✅ Open browser DevTools to inspect <code>var(--h1-color)</code> etc.</li>
                <li>✅ H1 headings should be <span style="color: #b01109;">RED and UPPERCASE</span> (test override)</li>
                <li>✅ Go to <strong>Appearance → Custom Styles</strong> to add your own overrides</li>
            </ul>
            <p><strong>Example Custom Style override:</strong></p>
            <code style="display: block; background: #f5f5f5; padding: 10px; margin: 10px 0;">
:root {<br>
&nbsp;&nbsp;--custom-h2-color: green;<br>
&nbsp;&nbsp;--custom-h3-font-style: italic;<br>
}
            </code>
        </div>
        <?php
    }
});
