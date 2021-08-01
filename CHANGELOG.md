# CSV Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2021-08-01

### Added

* Merged pull request #1 [Add TypeScript declaration file](https://github.com/Cipscis/csv/pull/1).
* Incorporated TypeScript declaration into tests.

## [1.1.0] - 2021-06-19

### Added

* The `parse` method now takes an options object that can contain a `mapper` function for mapping values.

## [1.0.9] - 2021-06-17

### Fixed

* Fixed typo in demonstration code.

## [1.0.8] - 2021-06-17

### Changed

* Rewrote demonstration code to have no dependencies.
* Moved change log into `CHANGELOG.md`.
* Updated `README.md`.

## [1.0.7] - 2021-06-16

### Added

* Added tests to GitHub workflow.

### Changed

* Rewrote tests using [Jasmine](https://jasmine.github.io/).

## [1.0.6] - 2021-06-12

### Added

* Added unit tests for `parse` and `stringify` functions, run via `npm test`.

## [1.0.5] - 2021-06-12

### Changed

* Added `"type": "module"` to the `package.config`, and adjusted the build system and server files accordingly.

## [1.0.4] - 2021-06-12

### Fixed

* Fixed incorrect parsing of CSV string using `parse` when the last value contained a comma and the string did not end on a newline character.

## [1.0.3] - 2021-06-12

### Added

* Added a [GitHub Action](https://docs.github.com/en/actions) to build the project on push to the `main` branch, then deploy the built project to the `gh-pages` branch.

### Changed

* Use [sass](https://www.npmjs.com/package/sass) to compile CSS, instead of the deprecated [node-sass](https://www.npmjs.com/package/node-sass) compiler used by [gulp-sass](http://www.npmjs.com/package/gulp-sass) by default.

## [1.0.2] - 2021-05-29

### Fixed

* Fixed incorrect break statement in Webpack config, and set development mode Webpack [devtool](https://webpack.js.org/configuration/devtool/) to `eval-source-map`.

## [1.0.1] - 2021-05-26

### Changed

* Combined main and documentation branches.

## [1.0.0] - 2021-05-23

### Added

* Initial commit
