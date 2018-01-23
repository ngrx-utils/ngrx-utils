# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

      <a name="0.4.0"></a>
# [0.4.0](https://github.com/ngrx-utils/ngrx-utils/compare/v0.3.1...v0.4.0) (2018-01-23)


### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/ngrx-utils/ngrx-utils/commit/0110678))


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
@Select('a', 'b', 'c') c: any;
}
```




      <a name="0.3.1"></a>
## [0.3.1](https://github.com/ngrx-utils/ngrx-utils/compare/v0.2.1...v0.3.1) (2018-01-22)


### Bug Fixes

* **store:** remove access to static member ([445b11d](https://github.com/ngrx-utils/ngrx-utils/commit/445b11d))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/ngrx-utils/ngrx-utils/compare/v0.1.6...v0.3.0) (2018-01-19)


### Features

* release with new build system ([8be3a7f](https://github.com/ngrx-utils/ngrx-utils/commit/8be3a7f))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/ngrx-utils/ngrx-utils/compare/v0.2.0...v0.2.1) (2018-01-18)




**Note:** Version bump only for package @ngrx-utils/store
