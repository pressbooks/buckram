# Changelog

## [1.8.4](https://github.com/pressbooks/buckram/compare/v1.8.3...v1.8.4) (2024-10-21)


### Bug Fixes

* mathjax class scope ([#367](https://github.com/pressbooks/buckram/issues/367)) ([711a842](https://github.com/pressbooks/buckram/commit/711a8428fd844ae79d0bcc27f0035de11d634c5f))

## [1.8.3](https://github.com/pressbooks/buckram/compare/v1.8.2...v1.8.3) (2024-10-07)


### Bug Fixes

* mathjax footnote support ([#364](https://github.com/pressbooks/buckram/issues/364)) ([6560bf7](https://github.com/pressbooks/buckram/commit/6560bf7aa05b32b78bb4891398870e3bade3dadc))

## [1.8.2](https://github.com/pressbooks/buckram/compare/v1.8.1...v1.8.2) (2023-07-16)


### Bug Fixes

* update release instructions ([#332](https://github.com/pressbooks/buckram/issues/332)) ([b60dda3](https://github.com/pressbooks/buckram/commit/b60dda36f6858f2bb55e4f536abdf1080194fac0))

## [1.8.1](https://github.com/pressbooks/buckram/compare/v1.8.0...v1.8.1) (2023-01-04)


### Bug Fixes

* update gitignore to avoid publish config files ([71fb1ae](https://github.com/pressbooks/buckram/commit/71fb1aefcba5807d65cd674c5a7947e5e19bbe06))

## [1.8.0](https://github.com/pressbooks/buckram/compare/v1.7.3...v1.8.0) (2023-01-03)


### Features

* make Buckram compatible with latest SCSSPHP ([#304](https://github.com/pressbooks/buckram/issues/304)) ([eb087ca](https://github.com/pressbooks/buckram/commit/eb087caf75ff026253904c64f8dbab335ec593f7))


### Bug Fixes

* unset content on blank pages instead of using an empty string ([#305](https://github.com/pressbooks/buckram/issues/305)) ([e9063fb](https://github.com/pressbooks/buckram/commit/e9063fbe89947173177369a4a293eba8bea5e6a6))

## [1.7.3](https://github.com/pressbooks/buckram/compare/v1.7.2...v1.7.3) (2022-08-19)


### Bug Fixes

* bump version in buckram.scss ([781bca0](https://github.com/pressbooks/buckram/commit/781bca0e9dc8051c099757201d0f6bbafffe43a4))

## [1.7.2](https://github.com/pressbooks/buckram/compare/1.7.1...v1.7.2) (2022-08-11)


### Bug Fixes

* don't publish .github to NPM ([c272287](https://github.com/pressbooks/buckram/commit/c27228756ed6066252451986c2be8cc4b6aa73db))

## 1.7.1 (2022-08-11)

### Bug Fixes

* resolve issues with extending compound selectors ([#275](https://github.com/pressbooks/buckram/issues/275)) ([4b2f2bb](https://github.com/pressbooks/buckram/commit/4b2f2bb938402981220fb75fe25b81aef17dcdeb))

## 1.7.0
### Minor changes
- Update semantic selectors to match Pressbooks changes [#887](https://github.com/pressbooks/pressbooks-book/pull/887/files)

### Dependencies
- Bump puppeteer to 11.0.0 [#890](https://github.com/pressbooks/pressbooks-book/pull/890)
- Bump mocha to 9.1.3 [#882](https://github.com/pressbooks/pressbooks-book/pull/882)
- Bump nth-check to 2.0.1 [#893](https://github.com/pressbooks/pressbooks-book/pull/893)

## 1.6.0
### Minor changes
- Add variables for new contributor feature

### Patches
- Fix max-width for center-aligned images: [#851](https://github.com/pressbooks/pressbooks-book/pull/851)

### Dependencies
- Bump puppeteer to 10.4.0: [#864](https://github.com/pressbooks/pressbooks-book/pull/864)
- Bump mocha to 9.1.1: [#846](https://github.com/pressbooks/pressbooks-book/pull/846)
- Bump pixelmatch to 5.2.1: [#810](https://github.com/pressbooks/pressbooks-book/pull/810)
- Bump urijs to 1.19.7: [#819](https://github.com/pressbooks/pressbooks-book/pull/819)
- Bump chai to 4.3.4: [#807](https://github.com/pressbooks/pressbooks-book/pull/807)
- Bump sassdoc to 2.7.3: [#804](https://github.com/pressbooks/pressbooks-book/pull/804)

## 1.5.3
### Patches
Fix positioning for images without captions: #788

### Dependencies
- Bump ws to 6.2.2: #787
- Bump color-string to 1.5.5: #789

## 1.5.2

###  Dependencies 
- Bump ua-parser-js to 0.7.28: #766
- Bump urijs to 1.19.6: #760
- Bump dot-prop to 4.2.1: #759
- Bump http-proxy to 1.18.1: #758
- Bump ini to 1.3.8: #757
- Bump lodash to 4.17.21: #761

## 1.5.1

### Patches 
- Color can be "initial", which is incompatible with border shorthand syntax
- Center image in table td using CSS (td img.aligncenter)
- Kindle limits usage of the display:none property for content blocks beyond 10000 characters. If the display:none property is applied to a content block that is bigger than 
  10000 characters, KindleGen returns an error. Fix is to use less display:none, and hope it affects fewer characters.
- Fix: $image-caption-text-color is often a map  

## 1.5.0

### Minor Changes

- Add Full Grid and Full Grid Landscape table options: [#575](https://github.com/pressbooks/pressbooks-book/pull/575)
- Add `overflow-wrap: normal;` to table of contents chapter number to prevent wrapping:[#574](https://github.com/pressbooks/pressbooks-book/pull/574)
- Add img.mathjax CSS: [#566](https://github.com/pressbooks/pressbooks-book/pull/566)
- Add `.landscape` class to add landscape option for large tables that overflow: [#563](https://github.com/pressbooks/pressbooks-book/pull/563)

### Patches
- Fix color variable for Table of Contents part title: [#559](https://github.com/pressbooks/pressbooks-book/pull/559)

## 1.4.0

### Minor Changes

- Add `$section-author-text-indent` variable: [#501](https://github.com/pressbooks/pressbooks-book/pull/501)
- Add color variable for `<dt>` elements: [#502](https://github.com/pressbooks/pressbooks-book/pull/502)
- Add `$title-publisher-float` and `$title-publisher-city-float` variables: [#503](https://github.com/pressbooks/pressbooks-book/pull/503)
- Add `$footote-font-family` variable and update `$footnote-font-weight`: [#544](https://github.com/pressbooks/pressbooks-book/pull/544)

### Patches

- Fix `td` border variable functionality: [#504](https://github.com/pressbooks/pressbooks-book/pull/504)
- Remove running content from blank pages on post introduction front matter: [#522](https://github.com/pressbooks/pressbooks-book/pull/522)
- Add 'if-map-get' to dt-color variable to fix parse error: [#528](https://github.com/pressbooks/pressbooks-book/pull/528)
- Fix: MOBI Table of Contents cannot be clicked: [#543](https://github.com/pressbooks/pressbooks-book/pull/543)
- Fix: Footnotes in headers inherit header styles: [#544](https://github.com/pressbooks/pressbooks-book/pull/544) [#546](https://github.com/pressbooks/pressbooks-book/pull/546) [#547](https://github.com/pressbooks/pressbooks-book/pull/547)

## 1.3.3

### Patches

- Center interactive content fallback images: [#497](https://github.com/pressbooks/pressbooks-book/pull/497)
