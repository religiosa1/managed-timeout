# managed-timeout changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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