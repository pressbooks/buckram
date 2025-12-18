# Page Layout Refactoring: Moving Logic from CSS to Application

## Overview

Currently, page layout logic (recto/verso handling, blank pages, page breaks) is handled primarily in SCSS/CSS. As part of the CSS custom properties migration, we should move this logic into the application layer (PHP/Blade templates) for better control and maintainability.

## Current State: CSS-Based Page Layouts

### How It Works Now

**In SCSS:**
```scss
// Example from theme options
@if $blank-pages-enabled {
  .chapter {
    page-break-before: right; // Force chapters to start on recto (right) page
  }
} @else {
  .chapter {
    page-break-before: always; // Start on next page regardless
  }
}

// Recto/verso handling
@page :left {
  @top-left {
    content: string(book-title);
  }
}

@page :right {
  @top-right {
    content: string(chapter-title);
  }
}
```

**Theme Options generate SCSS:**
```php
// In PDFOptions::scssOverrides()
$options = get_option('pressbooks_theme_options_pdf');

if ($options['pdf_blank_pages'] === 'remove') {
    $scss .= ".chapter { page-break-before: always; }\n";
} else {
    $scss .= ".chapter { page-break-before: right; }\n";
}
```

### Problems with Current Approach

1. **Logic in wrong layer** - Structural decisions made in CSS
2. **Limited flexibility** - Hard to add complex conditions
3. **Testing difficulty** - Can't unit test CSS logic
4. **Debugging** - Hard to trace why page breaks happen
5. **Runtime compilation** - Requires SCSS processing for options
6. **Separation of concerns** - Presentation mixed with structure

## Proposed Approach: Application-Level Logic

### Move Logic to Blade Templates

**Before (CSS-driven):**
```html
<!-- Simple HTML output -->
<div class="chapter">
  <h1>Chapter Title</h1>
  <div class="content">...</div>
</div>
```

```scss
// CSS handles page breaks
.chapter {
  page-break-before: right; // Always start on recto page
}
```

**After (Template-driven):**
```php
<!-- resources/views/export/chapter.blade.php -->
@php
$pageBreakBehavior = $options['pdf_blank_pages'] ?? 'include';
$chapterStartPage = $options['pdf_chapter_start_page'] ?? 'recto';
@endphp

<div class="chapter" 
     data-page-break-before="{{ $chapterStartPage === 'recto' ? 'right' : 'always' }}"
     @if($pageBreakBehavior === 'remove')
         data-force-next-page="true"
     @endif
>
  <h1>{{ $chapter->title }}</h1>
  <div class="content">{!! $chapter->content !!}</div>
</div>
```

```css
/* CSS just applies the data attributes */
.chapter[data-page-break-before="right"] {
  page-break-before: right;
}

.chapter[data-page-break-before="always"] {
  page-break-before: always;
}
```

### Benefits

1. **Testable** - Can unit test PHP logic
2. **Flexible** - Easy to add complex conditions
3. **Debuggable** - Clear trace from option to output
4. **No runtime compilation** - Just template rendering
5. **Separation of concerns** - Structure in PHP, styling in CSS

## Implementation Plan

### Phase 1: Identify CSS Logic to Move

#### Page Break Logic
**Current locations:**
- Chapter start pages (recto/verso/any)
- Part pages
- Front matter sections
- Back matter sections
- TOC placement
- Blank pages between sections

**SCSS variables affected:**
```scss
$chapter-start-page: recto !default; // 'recto', 'verso', 'any'
$part-start-page: recto !default;
$front-matter-start-page: any !default;
$back-matter-start-page: any !default;
$blank-pages: include !default; // 'include', 'remove'
```

#### Running Content Logic
**Current locations:**
- Header/footer content per page type
- Page number display
- Section title display
- Different content for recto/verso

**Considerations:**
- Some running content must stay in CSS (PrinceXML requirement)
- But the *logic* for what content to show can be in templates

#### Page Numbering Logic
**Current locations:**
- Front matter numbering (roman)
- Body matter numbering (arabic)
- Restart numbering rules

### Phase 2: Create Service Class

```php
<?php
/**
 * Page Layout Service
 * 
 * Handles logic for page breaks, recto/verso, and blank pages
 * 
 * @package Pressbooks\Export
 */

namespace Pressbooks\Export;

class PageLayout {
    
    /**
     * Get page break behavior for a section type
     * 
     * @param string $sectionType 'chapter', 'part', 'front-matter', 'back-matter'
     * @param array $options Theme options array
     * @return string 'right', 'left', 'always', or 'auto'
     */
    public function getPageBreakBefore(string $sectionType, array $options): string {
        $blankPages = $options['pdf_blank_pages'] ?? 'include';
        
        // If removing blank pages, use 'always' for all sections
        if ($blankPages === 'remove') {
            return 'always';
        }
        
        // Otherwise, check specific section preferences
        $startPageOption = $options["pdf_{$sectionType}_start_page"] ?? 'recto';
        
        return match($startPageOption) {
            'recto' => 'right',
            'verso' => 'left',
            'any' => 'always',
            default => 'right',
        };
    }
    
    /**
     * Determine if a blank page should be inserted before section
     * 
     * @param string $sectionType Current section type
     * @param string $previousSectionType Previous section type
     * @param int $currentPageNumber Simulated current page number
     * @param array $options Theme options
     * @return bool True if blank page should be inserted
     */
    public function shouldInsertBlankPage(
        string $sectionType, 
        string $previousSectionType,
        int $currentPageNumber,
        array $options
    ): bool {
        $blankPages = $options['pdf_blank_pages'] ?? 'include';
        
        // Never insert blank pages if option is to remove them
        if ($blankPages === 'remove') {
            return false;
        }
        
        // Get the desired start page for this section
        $desiredPage = $this->getPageBreakBefore($sectionType, $options);
        
        // If starting on right (recto) and currently on right page, insert blank
        if ($desiredPage === 'right' && $currentPageNumber % 2 === 1) {
            return true;
        }
        
        // If starting on left (verso) and currently on left page, insert blank
        if ($desiredPage === 'left' && $currentPageNumber % 2 === 0) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Get CSS class names for section based on page layout options
     * 
     * @param string $sectionType Section type
     * @param array $options Theme options
     * @return string Space-separated CSS classes
     */
    public function getSectionClasses(string $sectionType, array $options): string {
        $classes = [$sectionType];
        
        $pageBreak = $this->getPageBreakBefore($sectionType, $options);
        $classes[] = "page-break-{$pageBreak}";
        
        if ($options['pdf_blank_pages'] === 'remove') {
            $classes[] = 'no-blank-pages';
        }
        
        return implode(' ', $classes);
    }
    
    /**
     * Generate page-specific CSS based on options
     * 
     * This replaces SCSS variables with generated CSS
     * 
     * @param array $options Theme options
     * @return string CSS declarations
     */
    public function generatePageLayoutCSS(array $options): string {
        $css = '';
        
        // Generate page break rules based on options
        foreach (['chapter', 'part', 'front-matter', 'back-matter'] as $type) {
            $pageBreak = $this->getPageBreakBefore($type, $options);
            $className = str_replace('_', '-', $type);
            
            $css .= ".{$className} {\n";
            $css .= "  page-break-before: {$pageBreak};\n";
            $css .= "}\n\n";
        }
        
        // Add blank page handling if needed
        if ($options['pdf_blank_pages'] === 'remove') {
            $css .= ".no-blank-pages {\n";
            $css .= "  page-break-before: always;\n";
            $css .= "}\n\n";
        }
        
        return $css;
    }
    
    /**
     * Get page attributes for template
     * 
     * Returns data attributes and classes for HTML element
     * 
     * @param string $sectionType Section type
     * @param array $options Theme options
     * @return array ['class' => '...', 'data-attrs' => [...]]
     */
    public function getPageAttributes(string $sectionType, array $options): array {
        return [
            'class' => $this->getSectionClasses($sectionType, $options),
            'data-page-break' => $this->getPageBreakBefore($sectionType, $options),
            'data-blank-pages' => $options['pdf_blank_pages'] ?? 'include',
        ];
    }
}
```

### Phase 3: Update Blade Templates

**Chapter Template Example:**
```php
{{-- resources/views/export/pdf/chapter.blade.php --}}

@php
use Pressbooks\Export\PageLayout;

$pageLayout = app(PageLayout::class);
$attributes = $pageLayout->getPageAttributes('chapter', $options);
@endphp

<section 
    class="{{ $attributes['class'] }}" 
    data-page-break="{{ $attributes['data-page-break'] }}"
    data-section-type="chapter"
>
    @if($chapter->chapter_number && $options['chapter_numbers'])
        <div class="chapter-number-wrap">
            <span class="chapter-number">{{ $chapter->chapter_number }}</span>
        </div>
    @endif
    
    <div class="chapter-title-wrap">
        <h1 class="chapter-title">{{ $chapter->post_title }}</h1>
        
        @if($chapter->chapter_subtitle)
            <p class="chapter-subtitle">{{ $chapter->chapter_subtitle }}</p>
        @endif
        
        @if($chapter->chapter_author)
            <p class="chapter-author">{{ $chapter->chapter_author }}</p>
        @endif
    </div>
    
    <div class="ugc chapter-ugc">
        {!! $chapter->post_content !!}
    </div>
</section>

@if($pageLayout->shouldInsertBlankPage('chapter', 'previous', $pageNumber ?? 1, $options))
    <div class="blank-page" aria-hidden="true"></div>
@endif
```

**Part Template Example:**
```php
{{-- resources/views/export/pdf/part.blade.php --}}

@php
$pageLayout = app(PageLayout::class);
$attributes = $pageLayout->getPageAttributes('part', $options);
@endphp

<section 
    class="{{ $attributes['class'] }}"
    data-page-break="{{ $attributes['data-page-break'] }}"
    data-section-type="part"
>
    @if($part->part_number && $options['chapter_numbers'])
        <div class="part-number-wrap">
            <span class="part-number">{{ $part->part_number }}</span>
        </div>
    @endif
    
    <div class="part-title-wrap">
        <h1 class="part-title">{{ $part->post_title }}</h1>
    </div>
    
    @if($part->post_content)
        <div class="ugc part-ugc">
            {!! $part->post_content !!}
        </div>
    @endif
</section>
```

### Phase 4: Update Export Classes

**In PDF Export Class:**
```php
<?php
namespace Pressbooks\Modules\Export\Prince;

use Pressbooks\Export\PageLayout;

class PDF extends \Pressbooks\Modules\Export\Export {
    
    protected function generateHTML(): string {
        $pageLayout = new PageLayout();
        $options = get_option('pressbooks_theme_options_pdf');
        
        $vars = [
            'options' => $options,
            'pageLayout' => $pageLayout,
            'book_structure' => $this->getBookStructure(),
        ];
        
        return blade()->render('export.pdf.document', $vars);
    }
    
    protected function getCSS(): string {
        $styles = \Pressbooks\Container::get('Styles');
        $options = get_option('pressbooks_theme_options_pdf');
        $pageLayout = new PageLayout();
        
        // Load base CSS
        $css = $styles->loadBaseCSS('prince');
        
        // Add page layout CSS generated from options
        $css .= $pageLayout->generatePageLayoutCSS($options);
        
        // Add custom property overrides
        $css .= $styles->optionsToCssProperties($options, 'pdf_', 'prince');
        
        return $css;
    }
}
```

### Phase 5: Add Theme Options UI

**New Options:**
```php
// In PDFOptions class

[
    'pdf_blank_pages' => [
        'id' => 'pdf_blank_pages',
        'title' => __('Blank Pages', 'pressbooks'),
        'type' => 'select',
        'options' => [
            'include' => __('Include blank pages (for print binding)', 'pressbooks'),
            'remove' => __('Remove blank pages (for digital reading)', 'pressbooks'),
        ],
        'default' => 'include',
        'description' => __('Control whether blank pages are inserted to ensure chapters start on right-hand pages.', 'pressbooks'),
    ],
    'pdf_chapter_start_page' => [
        'id' => 'pdf_chapter_start_page',
        'title' => __('Chapter Start Page', 'pressbooks'),
        'type' => 'select',
        'options' => [
            'recto' => __('Right (recto) page', 'pressbooks'),
            'verso' => __('Left (verso) page', 'pressbooks'),
            'any' => __('Any page', 'pressbooks'),
        ],
        'default' => 'recto',
        'description' => __('Choose which type of page chapters should start on.', 'pressbooks'),
    ],
    'pdf_part_start_page' => [
        'id' => 'pdf_part_start_page',
        'title' => __('Part Start Page', 'pressbooks'),
        'type' => 'select',
        'options' => [
            'recto' => __('Right (recto) page', 'pressbooks'),
            'verso' => __('Left (verso) page', 'pressbooks'),
            'any' => __('Any page', 'pressbooks'),
        ],
        'default' => 'recto',
    ],
]
```

## Recto/Verso Handling

### Current CSS-Only Approach
```scss
@page :left {
  margin-left: 2cm;
  margin-right: 3cm;
  
  @top-left {
    content: string(book-title);
  }
}

@page :right {
  margin-left: 3cm;
  margin-right: 2cm;
  
  @top-right {
    content: string(chapter-title);
  }
}
```

### New Hybrid Approach

**Application sets string values:**
```php
{{-- In chapter template --}}
<h1 class="chapter-title" data-running-header="{{ $chapter->post_title }}">
    {{ $chapter->post_title }}
</h1>

@push('styles')
<style>
  .chapter-title {
    string-set: chapter-title "{{ addslashes($chapter->post_title) }}";
  }
</style>
@endpush
```

**CSS uses the strings:**
```css
/* Base layout - still in CSS (required by PrinceXML) */
@page :left {
  margin-left: var(--page-margin-inside);
  margin-right: var(--page-margin-outside);
  
  @top-left {
    content: string(chapter-title);
  }
}

@page :right {
  margin-left: var(--page-margin-outside);
  margin-right: var(--page-margin-inside);
  
  @top-right {
    content: string(chapter-title);
  }
}
```

**But margins come from options:**
```php
$options = get_option('pressbooks_theme_options_pdf');

// In generated CSS
:root {
  --page-margin-inside: {{ $options['pdf_page_margin_inside'] ?? '2cm' }};
  --page-margin-outside: {{ $options['pdf_page_margin_outside'] ?? '2cm' }};
}
```

## Testing Strategy

### Unit Tests for PageLayout Class

```php
<?php
namespace Pressbooks\Tests\Export;

use Pressbooks\Export\PageLayout;

class PageLayoutTest extends \WP_UnitTestCase {
    
    protected PageLayout $pageLayout;
    
    public function setUp(): void {
        parent::setUp();
        $this->pageLayout = new PageLayout();
    }
    
    public function test_getPageBreakBefore_with_blank_pages_included(): void {
        $options = ['pdf_blank_pages' => 'include'];
        
        $result = $this->pageLayout->getPageBreakBefore('chapter', $options);
        
        $this->assertEquals('right', $result);
    }
    
    public function test_getPageBreakBefore_with_blank_pages_removed(): void {
        $options = ['pdf_blank_pages' => 'remove'];
        
        $result = $this->pageLayout->getPageBreakBefore('chapter', $options);
        
        $this->assertEquals('always', $result);
    }
    
    public function test_shouldInsertBlankPage_when_needed(): void {
        $options = ['pdf_blank_pages' => 'include'];
        
        // Currently on page 5 (odd, recto), want to start on recto
        $result = $this->pageLayout->shouldInsertBlankPage(
            'chapter',
            'previous-chapter',
            5,
            $options
        );
        
        $this->assertTrue($result);
    }
    
    public function test_shouldNotInsertBlankPage_when_option_is_remove(): void {
        $options = ['pdf_blank_pages' => 'remove'];
        
        $result = $this->pageLayout->shouldInsertBlankPage(
            'chapter',
            'previous-chapter',
            5,
            $options
        );
        
        $this->assertFalse($result);
    }
    
    public function test_getSectionClasses_includes_page_break_class(): void {
        $options = ['pdf_blank_pages' => 'include'];
        
        $classes = $this->pageLayout->getSectionClasses('chapter', $options);
        
        $this->assertStringContainsString('page-break-right', $classes);
        $this->assertStringContainsString('chapter', $classes);
    }
    
    public function test_generatePageLayoutCSS_creates_valid_css(): void {
        $options = [
            'pdf_blank_pages' => 'include',
            'pdf_chapter_start_page' => 'recto',
        ];
        
        $css = $this->pageLayout->generatePageLayoutCSS($options);
        
        $this->assertStringContainsString('.chapter', $css);
        $this->assertStringContainsString('page-break-before: right', $css);
    }
}
```

### Integration Tests

Test that templates render correctly with different options:

```php
public function test_chapter_template_renders_with_recto_start(): void {
    $options = [
        'pdf_blank_pages' => 'include',
        'pdf_chapter_start_page' => 'recto',
    ];
    
    $html = blade()->render('export.pdf.chapter', [
        'chapter' => $this->getTestChapter(),
        'options' => $options,
    ]);
    
    $this->assertStringContainsString('page-break-right', $html);
    $this->assertStringContainsString('data-page-break="right"', $html);
}
```

## Migration Checklist

### SCSS Variables to Remove
- [ ] `$chapter-start-page`
- [ ] `$part-start-page`
- [ ] `$front-matter-start-page`
- [ ] `$back-matter-start-page`
- [ ] `$blank-pages`

### PHP Classes to Create
- [ ] `Pressbooks\Export\PageLayout` service class
- [ ] Unit tests for PageLayout
- [ ] Integration tests for templates

### Blade Templates to Create/Update
- [ ] `resources/views/export/pdf/chapter.blade.php`
- [ ] `resources/views/export/pdf/part.blade.php`
- [ ] `resources/views/export/pdf/front-matter.blade.php`
- [ ] `resources/views/export/pdf/back-matter.blade.php`

### Export Classes to Update
- [ ] `inc/modules/export/prince/class-pdf.php`
- [ ] Update `generateHTML()` method
- [ ] Update `getCSS()` method

### Theme Options to Update
- [ ] Add `pdf_blank_pages` option
- [ ] Add `pdf_chapter_start_page` option
- [ ] Add `pdf_part_start_page` option
- [ ] Update sanitization callbacks
- [ ] Update upgrade routine for existing options

### Documentation to Update
- [ ] Update theme development guide
- [ ] Document new theme options
- [ ] Update migration guide
- [ ] Add examples for custom themes

## Benefits of This Approach

1. **Testable** - Page layout logic can be unit tested
2. **Flexible** - Easy to add new conditions and rules
3. **Debuggable** - Clear trace from option to HTML to CSS
4. **Maintainable** - Logic in PHP, not spread across SCSS
5. **Performant** - No SCSS compilation needed
6. **Standards-compliant** - Uses proper separation of concerns

## Considerations

### PrinceXML Requirements
- Running content strings must still be set via CSS
- @page rules must remain in CSS
- But the *values* can come from templates

### EPUB Compatibility
- EPUB doesn't support @page rules
- Need different approach for EPUB page breaks
- Can use same template logic, different CSS output

### Backward Compatibility
- Provide compatibility layer for themes using old variables
- Deprecation warnings for SCSS-based page layout
- Migration tool for existing books

## Timeline

- **Week 1-2:** Implement PageLayout service class + tests
- **Week 3-4:** Create Blade templates
- **Week 5-6:** Update export classes
- **Week 7-8:** Add theme options UI
- **Week 9-10:** Testing and refinement
- **Week 11-12:** Documentation and migration guide

**Total:** ~3 months, can be done in parallel with CSS custom properties migration
