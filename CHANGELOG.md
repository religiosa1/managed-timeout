# managed-timeout changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unpublished
### Changed
- Timeout cancellation will result in Promise cancellation with reject error.

## [2.1.0] - 2022-01-24
### Added
- ESM module export added, UMD module changed to CJS.
- minifaction for the bundles (bundle size decreased to 3.2kB)
### Fix
- Potential errors when execute was called before start() call (with no cb provided)
- Incorrect execute() behavior on finished and cancelled state, introduced in 2.0.0
### Changed
- all private methods changed to be ECMAScript privates

## [2.0.0] - 2022-01-23
### Added
- state field
### Changed
- all private fields changed to be ECMAScript privates
- cb now recieves timeout instance as its argument, promise resolves with it too
- promise rejected value changed to be an error instance instead of a string
- non-int delay values now throw an error
### Removed
- ES5 support was dropped. ES2015 is now the minimum supported target.
### Security
- DevDependencies versions bumb

## [1.1.5] - 2021-11-18
### Changed
- DevDependencies version bump
- package-lock upgrade for node 16
## [1.1.4] - 2021-04-29
### Changed
- DevDependencies version bump
## [1.1.3] - 2020-08-17
### Added
- License file
### Changed
- Module type from commonjs to UMD
- tsconfig settings (module type and required libs)

## [1.1.2] - 2020-07-24
### Added
- Overloads for the constructor and start function
### Changed
- Tests reorganized
### Security
- DevDependencies versions bumb

## [1.1.1] - 2020-06-17
### Fixed
- README commonjs require() section to use named export
### Changed
- Tests have some minor changes in description wording and properties checked

## [1.1.0] - 2020-06-10
### Added
- Start method and delayed launch functionality
- isStarted property for delayed launch tracking
- Promise support
### Changed
- constructor recieved additional signature for the delayed launch
- missing types added for paused and delay properties
- _run private method now sets all the required properties itself
- reset method to accommodate delayed start functionality

## [1.0.0] - 2020-05-27
First public release