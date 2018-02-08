# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.6.0"></a>
# [0.6.0](https://github.com/sandangel/ngrx-utils/compare/v0.2.1...v0.6.0) (2018-02-08)


* Merge pull request #11 from sandangel/master ([f51adfa](https://github.com/sandangel/ngrx-utils/commit/f51adfa)), closes [#11](https://github.com/sandangel/ngrx-utils/issues/11)


### Bug Fixes

* **cli:** rewrite path for excute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))
* **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))


### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))


### Features

* **store:** add strong typed pluck operator ([7271de6](https://github.com/sandangel/ngrx-utils/commit/7271de6))
* **store:** add untilDestroy pipeaple operator ([71c7305](https://github.com/sandangel/ngrx-utils/commit/71c7305))
* **store:** experimental webworker service ([9b693ce](https://github.com/sandangel/ngrx-utils/commit/9b693ce))
* **store:** instroduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
* **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))
* **web-worker:** [WIP] initial work for web worker service ([0801e21](https://github.com/sandangel/ngrx-utils/commit/0801e21))


### BREAKING CHANGES

* feat(store): Select now support pipeable operator
* **store:** Deep nested prop in Select decorator will no longer available.

before:

```typescript
class MyComponent {
  @Select('a.b.c') c: any;
}
```

after:

```typescript
class MyComponent {
  @Select('a', 'b', 'c') c: any;
}
```



<a name="0.5.2"></a>
## [0.5.2](https://github.com/sandangel/ngrx-utils/compare/v0.5.1...v0.5.2) (2018-01-26)


### Bug Fixes

* **cli:** rewrite path for excute file ([8164603](https://github.com/sandangel/ngrx-utils/commit/8164603))



<a name="0.5.0"></a>

# [0.5.0](https://github.com/sandangel/ngrx-utils/compare/v0.2.1...v0.5.0) (2018-01-24)

### Bug Fixes

* **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))

### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))

### Features

* **store:** instroduce Pluck decorator ([67c08eb](https://github.com/sandangel/ngrx-utils/commit/67c08eb))
* **store:** select now support pipeable operator ([10977a1](https://github.com/sandangel/ngrx-utils/commit/10977a1))

### BREAKING CHANGES

* **store:** Deep nested prop in Select decorator will no longer available.

before:

```typescript
class MyComponent {
  @Select('a.b.c') c: any;
}
```

after:

```typescript
class MyComponent {
  @Pluck('a', 'b', 'c')
  c: any;
  // or
  @Pluck('a.b.c') c: any;
}
```

<a name="0.2.1"></a>

## [0.2.1](https://github.com/sandangel/ngrx-utils/compare/v0.3.0...v0.2.1) (2018-01-19)

<a name="0.3.0"></a>

# [0.3.0](https://github.com/sandangel/ngrx-utils/compare/v0.1.6...v0.3.0) (2018-01-19)

### Features

* release with new build system ([8be3a7f](https://github.com/sandangel/ngrx-utils/commit/8be3a7f))

### Performance Improvements

* improve ofAction performance ([d746e48](https://github.com/sandangel/ngrx-utils/commit/d746e48)), closes [#4](https://github.com/sandangel/ngrx-utils/issues/4)

<a name="0.1.6"></a>

## [0.1.6](https://github.com/sandangel/ngrx-utils/compare/v0.1.5...v0.1.6) (2018-01-17)

### Bug Fixes

* publish wrong folder ([95ca21c](https://github.com/sandangel/ngrx-utils/commit/95ca21c))
* release, work arround for lerna[#901](https://github.com/sandangel/ngrx-utils/issues/901) ([89049bb](https://github.com/sandangel/ngrx-utils/commit/89049bb))

<a name="0.1.5"></a>

## [0.1.5](https://github.com/sandangel/ngrx-utils/compare/v0.1.4...v0.1.5) (2018-01-17)

### Bug Fixes

* remove duplicate changelog message and cut release ([8ef6fb3](https://github.com/sandangel/ngrx-utils/commit/8ef6fb3))

<a name="0.1.4"></a>

## [0.1.4](https://github.com/sandangel/ngrx-utils/compare/v0.1.3...v0.1.4) (2018-01-17)

### Bug Fixes

* changelog message ([0359410](https://github.com/sandangel/ngrx-utils/commit/0359410))

<a name="0.1.3"></a>

## [0.1.3](https://github.com/sandangel/ngrx-utils/compare/v0.1.2...v0.1.3) (2018-01-17)

### Bug Fixes

* follow lerna publish ([88d9ed9](https://github.com/sandangel/ngrx-utils/commit/88d9ed9))
* lerna current version ([b82a6e7](https://github.com/sandangel/ngrx-utils/commit/b82a6e7))

<a name="0.1.2"></a>

## [0.1.2](https://github.com/sandangel/ngrx-utils/compare/v0.1.1...v0.1.2) (2018-01-17)

<a name="0.1.1"></a>

## 0.1.1 (2018-01-17)
