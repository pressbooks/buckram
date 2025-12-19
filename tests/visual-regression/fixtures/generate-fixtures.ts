/**
 * Generate HTML fixtures for Playwright visual regression tests
 * 
 * This script creates realistic book HTML samples with all Buckram elements
 * for testing visual output across SCSS and CSS custom properties.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const fixturesDir = join(__dirname, 'html');

// Ensure fixtures directory exists
try {
  mkdirSync(fixturesDir, { recursive: true });
} catch (e) {
  // Directory already exists
}

/**
 * Generate complete book chapter with all elements
 */
function generateCompleteChapter(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Complete Chapter Sample</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body class="chapter">
  <div id="post-1" class="chapter type-chapter">
    
    <!-- Chapter Title -->
    <div class="chapter-title-wrap">
      <h2 class="chapter-number">Chapter 1</h2>
      <h1 class="chapter-title">The Beginning of the Journey</h1>
      <p class="chapter-subtitle">An Introduction to Adventure</p>
      <p class="chapter-author">By Jane Smith</p>
    </div>

    <!-- Chapter Content -->
    <div class="chapter-content">
      
      <!-- Paragraphs -->
      <p class="first-para">This is the first paragraph with <strong>bold text</strong> and <em>italic text</em>. It should have proper indentation and spacing according to Buckram's paragraph styles.</p>
      
      <p>This is a standard paragraph. It should be indented and have proper line height. The text should flow naturally with appropriate word spacing and hyphenation rules applied.</p>
      
      <p>Another paragraph with a <a href="#footnote-1">footnote reference</a> and some <code>inline code</code> for testing.</p>

      <!-- Blockquote -->
      <blockquote>
        <p>This is a blockquote. It should have distinct styling with proper margins and indentation. Blockquotes often contain quoted text from other sources.</p>
        <p class="blockquote-citation">—Author Name, <em>Book Title</em></p>
      </blockquote>

      <!-- Headings -->
      <h2>Second Level Heading</h2>
      <p>Text after a heading should have proper spacing and not be indented.</p>

      <h3>Third Level Heading</h3>
      <p>More text content following a third-level heading.</p>

      <h4>Fourth Level Heading</h4>
      <p>And text after a fourth-level heading.</p>

      <!-- Lists -->
      <h3>Unordered List</h3>
      <ul>
        <li>First list item with some content</li>
        <li>Second list item
          <ul>
            <li>Nested list item</li>
            <li>Another nested item</li>
          </ul>
        </li>
        <li>Third list item</li>
      </ul>

      <h3>Ordered List</h3>
      <ol>
        <li>First ordered item</li>
        <li>Second ordered item
          <ol>
            <li>Nested ordered item</li>
            <li>Another nested ordered item</li>
          </ol>
        </li>
        <li>Third ordered item</li>
      </ol>

      <!-- Table -->
      <table>
        <caption>Sample Data Table</caption>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1-1</td>
            <td>Cell 1-2</td>
            <td>Cell 1-3</td>
          </tr>
          <tr>
            <td>Cell 2-1</td>
            <td>Cell 2-2</td>
            <td>Cell 2-3</td>
          </tr>
          <tr>
            <td>Cell 3-1</td>
            <td>Cell 3-2</td>
            <td>Cell 3-3</td>
          </tr>
        </tbody>
      </table>

      <!-- Code block -->
      <pre><code>function example() {
  console.log("This is a code block");
  return true;
}</code></pre>

      <!-- Images -->
      <figure class="wp-block-image">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E" alt="Placeholder image">
        <figcaption>Figure 1.1: This is an image caption with descriptive text</figcaption>
      </figure>

      <!-- Textbox -->
      <div class="textbox">
        <header class="textbox__header">
          <h3>Special Callout Box</h3>
        </header>
        <div class="textbox__content">
          <p>This is a special callout box with important information. It should have distinct styling to draw attention.</p>
        </div>
      </div>

      <!-- Footnotes -->
      <section class="footnotes" role="doc-endnotes">
        <h3>Footnotes</h3>
        <ol>
          <li id="footnote-1">
            <p>This is a footnote with additional information. <a href="#footnote-ref-1">↩</a></p>
          </li>
        </ol>
      </section>

    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate part opener
 */
function generatePartOpener(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Part Opener</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body class="part">
  <div id="post-1" class="part type-part">
    <div class="part-title-wrap">
      <h3 class="part-number">Part I</h3>
      <h1 class="part-title">The First Movement</h1>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate front matter
 */
function generateFrontMatter(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Front Matter</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body class="front-matter dedication">
  <div id="post-1" class="front-matter type-front-matter">
    <div class="front-matter-title-wrap">
      <h1 class="front-matter-title">Dedication</h1>
    </div>
    <div class="front-matter-content">
      <p class="dedication-content">For everyone who believes in the power of books.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate back matter
 */
function generateBackMatter(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Back Matter</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body class="back-matter about-author">
  <div id="post-1" class="back-matter type-back-matter">
    <div class="back-matter-title-wrap">
      <h1 class="back-matter-title">About the Author</h1>
    </div>
    <div class="back-matter-content">
      <p>Jane Smith is an award-winning author with over twenty years of experience in literary fiction. She lives in Portland, Oregon with her family.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate typography specimen
 */
function generateTypographySpecimen(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Typography Specimen</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body>
  <div class="typography-specimen">
    <h1>Heading Level 1</h1>
    <h2>Heading Level 2</h2>
    <h3>Heading Level 3</h3>
    <h4>Heading Level 4</h4>
    <h5>Heading Level 5</h5>
    <h6>Heading Level 6</h6>
    
    <p class="first-para">First paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    
    <p>Standard paragraph: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    
    <p><strong>Bold text</strong>, <em>italic text</em>, <strong><em>bold italic text</em></strong>, <code>inline code</code>, <a href="#">link text</a>, <sub>subscript</sub>, <sup>superscript</sup>.</p>
    
    <blockquote>
      <p>Blockquote paragraph with citation.</p>
      <p class="blockquote-citation">—Citation Source</p>
    </blockquote>
  </div>
</body>
</html>`;
}

/**
 * Generate table of contents
 */
function generateTOC(): string {
  return `<!DOCTYPE html>
<html lang="en" class="epub">
<head>
  <meta charset="UTF-8">
  <title>Table of Contents</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
</head>
<body class="front-matter toc">
  <div id="toc">
    <h1 class="toc-title">Contents</h1>
    <nav id="toc-nav" role="doc-toc">
      <ol>
        <li class="front-matter">
          <a href="#fm-1">Dedication</a>
        </li>
        <li class="part">
          <a href="#part-1">Part I: The First Movement</a>
          <ol>
            <li class="chapter">
              <a href="#chapter-1">
                <span class="chapter-number">1.</span>
                <span class="chapter-title">The Beginning of the Journey</span>
              </a>
            </li>
            <li class="chapter">
              <a href="#chapter-2">
                <span class="chapter-number">2.</span>
                <span class="chapter-title">Continuing Forward</span>
              </a>
            </li>
          </ol>
        </li>
        <li class="back-matter">
          <a href="#bm-1">About the Author</a>
        </li>
      </ol>
    </nav>
  </div>
</body>
</html>`;
}

/**
 * Generate Prince PDF specific page (with running headers)
 */
function generatePrincePage(): string {
  return `<!DOCTYPE html>
<html lang="en" class="prince">
<head>
  <meta charset="UTF-8">
  <title>Prince PDF Page</title>
  <link rel="stylesheet" href="../../assets/dist/styles/buckram.css">
  <style>
    @page {
      size: 6in 9in;
      margin-top: 1in;
      margin-bottom: 1in;
      
      @top-left {
        content: string(book-title);
      }
      
      @top-right {
        content: string(section-title);
      }
      
      @bottom-center {
        content: counter(page);
      }
    }
  </style>
</head>
<body class="chapter prince">
  <div id="post-1" class="chapter type-chapter">
    <div class="chapter-title-wrap">
      <h2 class="chapter-number">Chapter 1</h2>
      <h1 class="chapter-title">The Beginning of the Journey</h1>
    </div>
    <div class="chapter-content">
      <p class="first-para">This is a chapter in Prince PDF format with running headers and page numbers.</p>
      <p>The page should display running headers at the top and page numbers at the bottom.</p>
    </div>
  </div>
</body>
</html>`;
}

// Generate all fixtures
const fixtures = [
  { name: 'complete-chapter.html', content: generateCompleteChapter() },
  { name: 'part-opener.html', content: generatePartOpener() },
  { name: 'front-matter.html', content: generateFrontMatter() },
  { name: 'back-matter.html', content: generateBackMatter() },
  { name: 'typography-specimen.html', content: generateTypographySpecimen() },
  { name: 'table-of-contents.html', content: generateTOC() },
  { name: 'prince-page.html', content: generatePrincePage() },
];

// Write all fixtures to disk
fixtures.forEach(({ name, content }) => {
  const filePath = join(fixturesDir, name);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Generated ${name}`);
});

console.log(`\n✨ Successfully generated ${fixtures.length} HTML fixtures in ${fixturesDir}`);
