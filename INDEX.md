# Buckram CSS Custom Properties Migration - Documentation Index

Welcome to the Buckram CSS Custom Properties migration documentation! This index helps you navigate all the documentation and find what you need.

## Quick Navigation

**New to this project?** Start here:
1. [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md) - Overview and summary
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Step-by-step guide to begin
3. [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - Visual comparison of old vs new

**Ready to convert variables?**
1. [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Quick reference for patterns
2. [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Working examples

**Planning the full migration?**
1. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Complete migration plan
2. [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) - Proof of concept details

**Working on PHP integration?**
1. [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - Code examples

## Documentation Files

### Core Documentation

#### [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md)
**Purpose:** High-level overview and summary  
**Audience:** Everyone  
**Contents:**
- Project goals and benefits
- Quick start guide
- File structure overview
- Status and timeline
- Success criteria

**Read this first!**

---

#### [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md)
**Purpose:** Comprehensive migration plan  
**Audience:** Project leads, architects  
**Contents:**
- Background and motivation
- Current architecture analysis
- Detailed migration strategy (5 phases)
- Technical considerations
- Testing strategy
- Timeline estimates (3-4 months)
- Open questions and decisions

**Read this for:** Full project scope and planning

---

#### [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md)
**Purpose:** Visual comparison of architectures  
**Audience:** Decision makers, developers  
**Contents:**
- Side-by-side architecture diagrams
- Data flow comparisons
- Performance analysis
- Developer experience comparison
- Browser dev tools differences

**Read this for:** Understanding why we're migrating

---

### Practical Guides

#### [GETTING_STARTED.md](GETTING_STARTED.md)
**Purpose:** Step-by-step implementation guide  
**Audience:** Developers implementing the migration  
**Contents:**
- Quick start checklist
- POC implementation steps
- Testing procedures
- Phase 1 full checklist
- Troubleshooting tips

**Read this for:** Actually doing the work

---

#### [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md)
**Purpose:** Quick reference for converting variables  
**Audience:** Developers converting SCSS to CSS  
**Contents:**
- Conversion patterns (3 main patterns)
- Naming conventions
- PHP integration patterns
- Common pitfalls
- Checklist of variables to convert

**Read this for:** How to convert specific variables

---

#### [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md)
**Purpose:** Proof of concept documentation  
**Audience:** POC implementers  
**Contents:**
- POC goals
- Example conversions
- Variables to migrate first
- Variables to defer
- Testing the POC
- Benefits demonstration

**Read this for:** Running the initial proof of concept

---

### Strategy Documents

#### [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md)
**Purpose:** Moving page layout logic from CSS to application  
**Audience:** Backend developers, architects  
**Contents:**
- Current CSS-based page layout problems
- Proposed application-level approach
- PageLayout service class design
- Blade template examples
- Recto/verso handling
- Testing strategy for page layouts

**Read this for:** Understanding the page layout refactoring

---

#### [TESTING_PLAN.md](TESTING_PLAN.md)
**Purpose:** Comprehensive testing strategy for all formats  
**Audience:** QA engineers, developers  
**Contents:**
- Format-specific testing (webbook, PDF, EPUB)
- Automated test suites (PHPUnit, Playwright)
- Visual regression testing
- Manual testing checklists
- Performance benchmarks
- Cross-browser/reader compatibility
- Test automation with GitHub Actions

**Read this for:** How to test the migration thoroughly

---

### Code Examples

#### [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css)
**Purpose:** Working example of converted variables  
**Audience:** Developers  
**Contents:**
- Actual converted CSS variables
- Root declarations
- Component usage examples
- Theme override examples
- Heavily commented for learning

**Read this for:** See what the output looks like

---

#### [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php)
**Purpose:** PHP code examples for integration  
**Audience:** PHP developers  
**Contents:**
- New Styles class methods
- PDF export updates
- Theme options updates
- Web options updates
- Compatibility checking
- PageLayout service class

**Read this for:** Backend integration code

---

## 🗺️ Reading Paths

### Path 1: "I need to understand the project"
1. [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md) - Overview
2. [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - See the difference
3. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Full plan

**Time:** 30-45 minutes

---

### Path 2: "I need to implement the POC"
1. [GETTING_STARTED.md](GETTING_STARTED.md) - Setup and steps
2. [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Conversion patterns
3. [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Examples
4. [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) - POC details

**Time:** 1-2 hours + implementation time

---

### Path 3: "I need to update the PHP backend"
1. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Phase 3 section
2. [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - Code examples
3. [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Application logic
4. [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - PHP integration patterns

**Time:** 1-2 hours + implementation time

---

### Path 5: "I need to set up testing"
1. [TESTING_PLAN.md](TESTING_PLAN.md) - Complete testing strategy
2. [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Page layout tests
3. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Testing strategy section

**Time:** 1-2 hours + test implementation time

---

### Path 4: "I need to update a theme"
1. [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Naming conventions
2. [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Override examples
3. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Phase 5 section

**Time:** 30 minutes + theme work

---

## By Role

### Project Manager
**Priority reads:**
1. [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md) - Overview
2. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Timeline and phases
3. [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - Benefits

**Focus:** Timeline, resources needed, benefits, risks

---

### Frontend Developer
**Priority reads:**
1. [GETTING_STARTED.md](GETTING_STARTED.md) - How to start
2. [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Patterns
3. [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Examples

**Focus:** Converting variables, testing, theme updates

---

### Backend Developer (PHP)
**Priority reads:**
1. [TESTING_PLAN.md](TESTING_PLAN.md) - Complete testing strategy ⭐
2. [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md) - What's being built
3. [GETTING_STARTED.md](GETTING_STARTED.md) - Testing sections
4. [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Page layout testing

**Focus:** Test matrices, automation, manual checklists, visual regression

---

### QA / Tester
**Priority reads:**
1. [README_CSS_CUSTOM_PROPERTIES.md](README_CSS_CUSTOM_PROPERTIES.md) - What's being built
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Testing sections
3. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Testing strategy

**Focus:** Test matrices, success criteria, regression testing

---

### Architect / Tech Lead
**Priority reads:**
1. [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - System design
2. [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Full plan
3. [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - Integration

**Focus:** Architecture decisions, technical approach, risks

---

## By Topic

### Understanding Current SCSS System
- [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - "Current Architecture" section
- [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - "SCSS Flow" sections

### Understanding CSS Custom Properties
- [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - All patterns
- [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Live examples
- External: [MDN CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Variable Conversion
- [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Primary reference
- [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) - Examples
- [GETTING_STARTED.md](GETTING_STARTED.md) - Step 4

### PHP Integration
- [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - All examples
- [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - "PHP Integration Patterns"
- [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Phase 3

### Theme Development
- [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Phase 5
- [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) - Override examples
- [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Override patterns

###TESTING_PLAN.md](TESTING_PLAN.md) - Comprehensive testing strategy ⭐
- [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Page layout testing
- [GETTING_STARTED.md](GETTING_STARTED.md) - Steps 5-7
- [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Testing strategy
- [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) - Testing the POC

### Page Layout Logic
- [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) - Moving logic to application
- [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php) - PageLayout service class.md) - Testing strategy
- [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) - Testing the POC

### Performance
- [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) - Performance section
- [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Benefits

---

## 🔍 Search Guide

Looking for something specific?

| What you need | Where to find it |
|---------------|------------------|
| Timeline estimates | [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) - Timeline section |
| Naming conventions | [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) - Naming section |
| Override examples | [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css) |
| PHP code examples | [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php)
| Testing strategy | [TESTING_PLAN.md](TESTING_PLAN.md) ⭐ |
| Page layout refactoring | [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md) | |
| Architecture diagrams | [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) |
| Migration phases | [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md) |
| Quick start steps | [GETTING_STARTED.md](GETTING_STARTED.md) |
| Conversion patterns | [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) |
| POC steps | [POC_SIMPLE_VARIABLES.md](POC_SIMPLE_VARIABLES.md) |
| Benefits/motivation | [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md) |

---

## 📝 Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| PAGE_LAYOUT_REFACTORING.md | ✅ Complete | 2024-12-18 |
| TESTING_PLAN.md | ✅ Complete | 2024-12-18 |
| README_CSS_CUSTOM_PROPERTIES.md | ✅ Complete | 2024-12-18 |
| CSS_CUSTOM_PROPERTIES_MIGRATION.md | ✅ Complete | 2024-12-18 |
| ARCHITECTURE_COMPARISON.md | ✅ Complete | 2024-12-18 |
| CONVERSION_GUIDE.md | ✅ Complete | 2024-12-18 |
| GETTING_STARTED.md | ✅ Complete | 2024-12-18 |
| POC_SIMPLE_VARIABLES.md | ✅ Complete | 2024-12-18 |
| PHP_INTEGRATION_EXAMPLES.php | ✅ Complete | 2024-12-18 |
| poc/buckram-variables-simple.css | ✅ Complete | 2024-12-18 |

---

## Quick Actions

**Want to:**
- **Start the POC?** → [GETTING_STARTED.md](GETTING_STARTED.md)
- **Convert a variable?** → [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md)
- **Set up testing?** → [TESTING_PLAN.md](TESTING_PLAN.md) ⭐
- **Refactor page layouts?** → [PAGE_LAYOUT_REFACTORING.md](PAGE_LAYOUT_REFACTORING.md)
- **See examples?** → [poc/buckram-variables-simple.css](poc/buckram-variables-simple.css)
- **Understand architecture?** → [ARCHITECTURE_COMPARISON.md](ARCHITECTURE_COMPARISON.md)
- **Update PHP code?** → [PHP_INTEGRATION_EXAMPLES.php](PHP_INTEGRATION_EXAMPLES.php)
- **Review full plan?** → [CSS_CUSTOM_PROPERTIES_MIGRATION.md](CSS_CUSTOM_PROPERTIES_MIGRATION.md)

---

## Tips for Reading

1. **Start high-level** - README first, then dive deeper
2. **Use the reading paths** - They're designed for efficiency
3. **Check examples** - Code examples clarify concepts
4. **Cross-reference** - Documents reference each other
5. **Update as you go** - Found something unclear? Improve it!

---

## Questions?

If you can't find what you need:
1. Search within these documents (Ctrl+F)
2. Check the external resources linked
3. Review related code in the repo
4. Ask the team
5. Update documentation with the answer!

---

**Last Updated:** December 18, 2025  
**Maintained by:** Pressbooks Development Team
