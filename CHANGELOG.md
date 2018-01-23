<a name="0.4.0"></a>
# [0.4.0](https://github.com/sandangel/ngrx-utils/compare/v0.3.1...v0.4.0) (2018-01-23)


### Code Refactoring

* **store:** remove deep nested prop of Select ([0110678](https://github.com/sandangel/ngrx-utils/commit/0110678))


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
## [0.3.1](https://github.com/sandangel/ngrx-utils/compare/v0.2.1...v0.3.1) (2018-01-22)


### Bug Fixes

* **store:** remove access to static member ([445b11d](https://github.com/sandangel/ngrx-utils/commit/445b11d))


### Performance Improvements

* improve ofAction performance ([d746e48](https://github.com/sandangel/ngrx-utils/commit/d746e48)), closes [#4](https://github.com/sandangel/ngrx-utils/issues/4)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/sandangel/ngrx-utils/compare/v0.2.0...v0.2.1) (2018-01-18)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/sandangel/ngrx-utils/compare/v0.1.5...v0.2.0) (2018-01-18)


### Bug Fixes

* publish wrong folder ([95ca21c](https://github.com/sandangel/ngrx-utils/commit/95ca21c))
* release, work arround for lerna[#901](https://github.com/sandangel/ngrx-utils/issues/901) ([89049bb](https://github.com/sandangel/ngrx-utils/commit/89049bb))


### Features

* release with new build system ([8be3a7f](https://github.com/sandangel/ngrx-utils/commit/8be3a7f))



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



