<a name="0.11.0-beta.1"></a>

# [0.11.0-beta.1](https://github.com/sandangel/ngrx-utils/compare/0.11.0-beta.0...0.11.0-beta.1) (2018-04-12)

### Bug Fixes

* switch back to angular 5 for compatible with ng-packagr ([51830b0](https://github.com/sandangel/ngrx-utils/commit/51830b0))

<a name="0.11.0-beta.0"></a>

# [0.11.0-beta.0](https://github.com/sandangel/ngrx-utils/compare/v0.10.0...v0.11.0-beta.0) (2018-04-11)

### Features

* **store:** add routerLinkMatch directive ([0bc108f](https://github.com/sandangel/ngrx-utils/commit/0bc108f))
* **store:** support dispatch multi actions in @Dispatch() ([c7d8195](https://github.com/sandangel/ngrx-utils/commit/c7d8195))
* **store:** push pipe for ngZone: 'noop' ([771b195](https://github.com/sandangel/ngrx-utils/commit/771b195))

### Code Refactoring

* **store:** upgrade to Angular 6, rxjs 6 and Ngrx 6

<a name="0.10.0"></a>

# [0.10.0](https://github.com/sandangel/ngrx-utils/compare/v0.9.0...v0.10.0) (2018-02-25)

### Bug Fixes

* **store:** fix incorrect descriptor spread order in Select decorator ([2a08ab0](https://github.com/sandangel/ngrx-utils/commit/2a08ab0))
* **store:** fix incorrect spread descriptor in Pluck decorator ([817a0e1](https://github.com/sandangel/ngrx-utils/commit/817a0e1))

### Features

* **store:** introduce Dispatch decorator ([b6d2f9a](https://github.com/sandangel/ngrx-utils/commit/b6d2f9a))
* **store:** reintroduce NgrxUtilsModule ([00b5177](https://github.com/sandangel/ngrx-utils/commit/00b5177))

<a name="0.9.0"></a>

# [0.9.0](https://github.com/sandangel/ngrx-utils/compare/v0.8.0...v0.9.0) (2018-02-24)

### Code Refactoring

* **store:** rename NgrxUtilsModule to NgrxSelectModule ([83d4add](https://github.com/sandangel/ngrx-utils/commit/83d4add))

### BREAKING CHANGES

* **store:** Rename NgrxUtilsModule to NgrxSelectModule

<a name="0.8.0"></a>

# [0.8.0](https://github.com/sandangel/ngrx-utils/compare/v0.7.1...v0.8.0) (2018-02-22)

### Code Refactoring

* remove cli, effects package ([16b8e77](https://github.com/sandangel/ngrx-utils/commit/16b8e77)), closes [#25](https://github.com/sandangel/ngrx-utils/issues/25)

### Features

* **store:** introduce ngLet directive ([899ad9c](https://github.com/sandangel/ngrx-utils/commit/899ad9c))

### BREAKING CHANGES

* Due to violation of Redux principle, effects and CLI package are removed. Please
  use ngrx-actions if you still want ofAction operator

<a name="0.7.1"></a>

## [0.7.1](https://github.com/sandangel/ngrx-utils/compare/v0.7.0...v0.7.1) (2018-02-13)

<a name="0.7.0"></a>

# [0.7.0](https://github.com/sandangel/ngrx-utils/compare/v0.6.3...v0.7.0) (2018-02-13)

### Code Refactoring

* **effects:** deprecated ofAction operator ([00c2eeb](https://github.com/sandangel/ngrx-utils/commit/00c2eeb))

### Features

* auto connect to root store ([f18ca7c](https://github.com/sandangel/ngrx-utils/commit/f18ca7c))

### BREAKING CHANGES

* **effects:** Due to conditional type feature will release in TS 2.8, ofAction is no longer
  needed and will be removed when v1.0 release
* You won't need to explicitly connect @ngrx-utils to your store. But it won't harm if you let your code same as v0.6.3

<a name="0.6.3"></a>

## [0.6.3](https://github.com/sandangel/ngrx-utils/compare/v0.6.2...v0.6.3) (2018-02-09)

### Bug Fixes

* **store:** spread Select addition operators in pipe ([9eb8401](https://github.com/sandangel/ngrx-utils/commit/9eb8401))

<a name="0.6.2"></a>

## [0.6.2](https://github.com/sandangel/ngrx-utils/compare/v0.6.1...v0.6.2) (2018-02-08)

### Bug Fixes

* **store:** use select method instead of operator ([b1213e9](https://github.com/sandangel/ngrx-utils/commit/b1213e9))

<a name="0.6.0"></a>

# [0.6.0](https://github.com/sandangel/ngrx-utils/compare/v0.5.2...v0.6.0) (2018-02-08)

### Bug Fixes

* **cli:** rewrite path for execute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))
* **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))

### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))

### Features

* **store:** add strong typed pluck operator ([7271de6](https://github.com/sandangel/ngrx-utils/commit/7271de6))
* **store:** add untilDestroy pipeaple operator ([71c7305](https://github.com/sandangel/ngrx-utils/commit/71c7305))
* **store:** experimental webworker service ([9b693ce](https://github.com/sandangel/ngrx-utils/commit/9b693ce))
* **store:** introduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
* **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))

<a name="0.5.2"></a>

## [0.5.2](https://github.com/sandangel/ngrx-utils/compare/v0.5.1...v0.5.2) (2018-01-26)

### Bug Fixes

* **cli:** rewrite path for execute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))

<a name="0.5.0"></a>

# [0.5.0](https://github.com/sandangel/ngrx-utils/compare/v0.2.1...v0.5.0) (2018-01-24)

### Bug Fixes

* **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))

### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))

### Features

* **store:** introduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
* **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))
