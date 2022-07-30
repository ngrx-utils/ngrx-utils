# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
<a name="0.11.0"></a>

# [0.14.0](https://github.com/ngrx-utils/ngrx-utils/compare/v0.14.0...v0.13.0) (2022-07-30)

### Notes:

- **store:** upgraded to angular 14
- **store:** refactor routerLinkMatch directive
- **store:** removed deprecated `pluck` operator

# [0.13.0](https://github.com/ngrx-utils/ngrx-utils/compare/v0.12.1...v0.13.0) (2020-04-12)

### Notes:

- **store:** upgraded to angular 9
- **store:** remove dependencies on @ngrx/store
- **store:** fix router link active match regexp
- **store:** removed deprecated Select, Dispatch, Pluck decorators

<a name="0.11.0"></a>

# [0.11.0](https://github.com/sandangel/ngrx-utils/compare/v0.10.0...v0.11.0) (2018-04-29)

### Features

- **store:** push pipe support for ngZone: 'noop' ([7ffeb6b](https://github.com/sandangel/ngrx-utils/commit/7ffeb6b))
- **store:** router link active match regexp ([4293b37](https://github.com/sandangel/ngrx-utils/commit/4293b37))
- **store:** support dispatch multi actions in @Dispatch() ([c61a3ef](https://github.com/sandangel/ngrx-utils/commit/c61a3ef))
- This library now is built with @angular/bazel ([1dd5eb4](https://github.com/sandangel/ngrx-utils/commit/1dd5eb4))

<a name="0.10.0"></a>

# [0.10.0](https://github.com/sandangel/ngrx-utils/compare/v0.9.0...v0.10.0) (2018-02-25)

### Bug Fixes

- **store:** fix incorrect descriptor spread order in Select decorator ([2a08ab0](https://github.com/sandangel/ngrx-utils/commit/2a08ab0))
- **store:** fix incorrect spread descriptor in Pluck decorator ([817a0e1](https://github.com/sandangel/ngrx-utils/commit/817a0e1))

### Features

- **store:** introduce Dispatch decorator ([b6d2f9a](https://github.com/sandangel/ngrx-utils/commit/b6d2f9a))
- **store:** reintroduce NgrxUtilsModule ([00b5177](https://github.com/sandangel/ngrx-utils/commit/00b5177))

<a name="0.9.0"></a>

# [0.9.0](https://github.com/sandangel/ngrx-utils/compare/v0.8.0...v0.9.0) (2018-02-24)

### Code Refactoring

- **store:** rename NgrxUtilsModule to NgrxSelectModule ([83d4add](https://github.com/sandangel/ngrx-utils/commit/83d4add))

### BREAKING CHANGES

- **store:** Rename NgrxUtilsModule to NgrxSelectModule

<a name="0.8.0"></a>

# [0.8.0](https://github.com/sandangel/ngrx-utils/compare/v0.7.1...v0.8.0) (2018-02-22)

### Code Refactoring

- remove cli, effects package ([16b8e77](https://github.com/sandangel/ngrx-utils/commit/16b8e77)), closes [#25](https://github.com/sandangel/ngrx-utils/issues/25)

### Features

- **store:** introduce ngLet directive ([899ad9c](https://github.com/sandangel/ngrx-utils/commit/899ad9c))

### BREAKING CHANGES

- Due to violation of Redux principle, effects and CLI package are removed. Please
  use ngrx-actions if you still want ofAction operator

<a name="0.7.1"></a>

## [0.7.1](https://github.com/sandangel/ngrx-utils/compare/v0.7.0...v0.7.1) (2018-02-13)

<a name="0.7.0"></a>

# [0.7.0](https://github.com/sandangel/ngrx-utils/compare/v0.6.3...v0.7.0) (2018-02-13)

### Code Refactoring

- **effects:** deprecated ofAction operator ([00c2eeb](https://github.com/sandangel/ngrx-utils/commit/00c2eeb))

### Features

- auto connect to root store ([f18ca7c](https://github.com/sandangel/ngrx-utils/commit/f18ca7c))

### BREAKING CHANGES

- **effects:** Due to conditional type feature will release in TS 2.8, ofAction is no longer
  needed and will be removed when v1.0 release
- You won't need to explicitly connect @ngrx-utils to your store. But it won't harm if you let your code same as v0.6.3

<a name="0.6.3"></a>

## [0.6.3](https://github.com/sandangel/ngrx-utils/compare/v0.6.2...v0.6.3) (2018-02-09)

### Bug Fixes

- **store:** spread Select addition operators in pipe ([9eb8401](https://github.com/sandangel/ngrx-utils/commit/9eb8401))

<a name="0.6.2"></a>

## [0.6.2](https://github.com/sandangel/ngrx-utils/compare/v0.6.1...v0.6.2) (2018-02-08)

### Bug Fixes

- **store:** use select method instead of operator ([b1213e9](https://github.com/sandangel/ngrx-utils/commit/b1213e9))

<a name="0.6.0"></a>

# [0.6.0](https://github.com/sandangel/ngrx-utils/compare/v0.5.2...v0.6.0) (2018-02-08)

### Bug Fixes

- **cli:** rewrite path for execute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))
- **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))

### Code Refactoring

- **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))

### Features

- **store:** add strong typed pluck operator ([7271de6](https://github.com/sandangel/ngrx-utils/commit/7271de6))
- **store:** add untilDestroy pipeaple operator ([71c7305](https://github.com/sandangel/ngrx-utils/commit/71c7305))
- **store:** experimental webworker service ([9b693ce](https://github.com/sandangel/ngrx-utils/commit/9b693ce))
- **store:** introduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
- **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))

<a name="0.5.2"></a>

## [0.5.2](https://github.com/sandangel/ngrx-utils/compare/v0.5.1...v0.5.2) (2018-01-26)

### Bug Fixes

- **cli:** rewrite path for execute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))

<a name="0.5.0"></a>

# [0.5.0](https://github.com/sandangel/ngrx-utils/compare/v0.2.1...v0.5.0) (2018-01-24)

### Bug Fixes

- **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))

### Code Refactoring

- **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))

### Features

- **store:** introduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
- **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))
