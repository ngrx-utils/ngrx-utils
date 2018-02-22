# @ngrx-utils

[![CircleCI](https://circleci.com/gh/ngrx-utils/ngrx-utils.svg?style=svg)](https://circleci.com/gh/ngrx-utils/ngrx-utils) [![Maintainability](https://api.codeclimate.com/v1/badges/481564ca973db91b89e5/maintainability)](https://codeclimate.com/github/ngrx-utils/ngrx-utils/maintainability) [![Coverage Status](https://coveralls.io/repos/github/ngrx-utils/ngrx-utils/badge.svg?branch=master)](https://coveralls.io/github/ngrx-utils/ngrx-utils?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/ngrx-utils/ngrx-utils/badge.svg)](https://snyk.io/test/github/ngrx-utils/ngrx-utils)

This is a library provide utility functions, decorators, directives..., cli tools to help reduce boilerplate and speedup your devs when working on Angular and `@ngrx`.

When you have built some cool stuffs and want to share but you just don't have time to build your own package, setup test, ci... Or when you feel the PR process at angular repo is taking too long since angular team are busy with their priorities, you can just send a PR here.

I have found that the angular community has create tons of awesome features and they really want to add it to angular itself but their PR sometime just end up with a long long discussion and then be closed. Instead you could modular it to an NgModule, operators, functions, add it here and start using it at your project after CI done.

## Quick start

```sh
npm i -S @ngrx-utils/store
# or
yarn add @ngrx-utils/store
```

## What in the box?

### ngLet directive

* You will find yourself often use `*ngIf="stream$ | async as stream" to subscribe to an observable property and rename it to a template variable. The downside of this approach is the template will be removed even when you really want to use the value`false`,`0`... or when you use 2 observable property nested in template like this:

```typescript
@Component({
  selector: 'my-comp',
  template: `
    <ng-container *ngIf="(filterDate$ | async) as filterDate">
      <pick-date [registeredAt]="(device$ | async)?.registeredAt"
                    (reloadItems)="onReloadTruckItems($event)"
                    [firstDate]="filterDat.from"
                    [secondDate]="filterDate.to"
                    (loadItems)="onLoadTruckItems($event)"></pick-date>
    </ng-container>  
  `
})
export class MyComponent {
  device$: Observable<Device>;
  filterDate$: Observable<FilterDate>;

  constructor(store: Store<State>) {
    this.device$ = store.select('device');
    this.filterDate$ = store.select('filterDate');
  }
}
```

* Look at filterDate$ property, you have to subscribe to it twice for firstDate and secondDate binding in `pick-date` component if you use normal approach. So you have to wrap template by `ng-container` and subscribe to it once as above. Unfortunately there was another binding need is `[registerAt]` on pick-date component and it's only available by `device.registerAt`.

What if you have device but you don't have filterDate (If filterDate is null, may be it will just result as empty input of a form)? The template will then be completely removed from the page.

* NgLet to rescue:

```typescript
import { NgLetModule } from '@ngrx-utils/store';

@NgModule({
  imports: [NgLetModule]
})
export class FeatureModule {}
```

Replace `*ngIf` with `*ngLet`:

```html
    <ng-container *ngLet="(filterDate$ | async) as filterDate">
      <pick-date [registeredAt]="(device$ | async)?.registeredAt"
                    (reloadItems)="onReloadTruckItems($event)"
                    [firstDate]="filterDat.from"
                    [secondDate]="filterDate.to"
                    (loadItems)="onLoadTruckItems($event)"></pick-date>
    </ng-container>  
```

This way your template display as normal even when filterDate does is null. ^^

### untilDestroy pipeable operator

* You no longer have to manually call unsubscribe with observable on `ngOnDestroy`:

```typescript
import { untilDestroy } from '@ngrx-utils/store';

export class MyComponent implements OnDestroy {
  user: User;

  constructor(userService: UserService) {
    userService
      .getUsers()
      /** Automatically unsubscribe on destroy */
      .pipe(untilDestroy(this))
      .subscribe(user => (this.user = user));
  }

  /** Must have */
  ngOnDestroy() {}
}
```

* NOTE: You still have to declare `ngOnDestroy` in Component because Angular does not support dynamic add component method in AOT mode

* Credit to @SanderElias, this operator is inspired from his idea but he's currently not publishing it as an npm package.

### strong type `pluck` operattor

* You can also make use of pluck operator, a wrapper function of `rxjs/operators/pluck` but supporting nice type inference.

```typescript
import { pluck } from '@ngrx-utils/store';

@Component({
  selector: 'sand-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @Pluck('layout.sidenavOpened') opened$: Observable<boolean>;

  sidenavMode: 'over' | 'push' | 'side';

  constructor(bpo: BreakpointObserver, store: Store<LayoutState>) {
    bpo
      .observe([Breakpoints.XSmall])
      /** Type check here */
      .pipe(pluck('matches'), untilDestroy(this))
      .subscribe(
        isSmallScreen =>
          (this.sidenavMode = isSmallScreen
            ? (store.dispatch(createSetSidenav(false)), 'over')
            : (store.dispatch(createSetSidenav(true)), 'side'))
      );
  }

  ngOnDestroy() {}
}
```

![picture](https://media.giphy.com/media/3ohs4yQkU3hYGLl3Tq/giphy.gif)

### `@Select & @Pluck` decorator

* Inspired from [ngrx-actions](https://github.com/amcdnl/ngrx-actions) by @amcdnl.

* No more `this.prop = this.store.select(/* some prop */)` in your Component, now you can use `@Select or @Pluck` decorator instead.

* `@Select` decorator is now support pipeable operator => you can use operator like take(1) to automatically unsubscribe or transform that value so you won't need to create more selectors with nested property...

* `@Select` accepts first parameter as a selector type `(state: any) => any` to select prop from your store (like selectors created with `createSelector` from `@ngrx/store`) and up to 8 pipeable operators.

* `@Pluck` accepts an array of state property name start from root state. It also support a 'dot' separated shorthand syntax and use Component property name when no argument is specified.

```typescript
import { take, map } from 'rxjs/operators';

export class MyComponent {
  @Select(fromRoot.getRouterState, map(state => state.url), take(1))
  url$: Observable<string>;

  @Pluck('featureState', 'prop1')
  prop1: Observable<any>;

  @Pluck('featureState.prop2') prop2: Observable<any>;

  @Pluck() featureState: Observable<any>;
}
```

> Note: Decorator has a limitation is it lack of type checking due to [TypeScript#4881](https://github.com/Microsoft/TypeScript/issues/4881).
>
> You can't use `this` keyword inside `@Select()` because it's a function call with different context

```typescript
/**
 * This won't work.
 */
export class MyComponent {
  @Select(
    fromRoot.getRouterState,
    map(state => /* `this` here is a global object*/ this.update(state))
  )
  url$: Observable<string>; /* if you use `Observable<number>` here it won't throw an error */

  update(state: any) {
    /* ... */
  }
}
```

## Getting Started in 1 minute

### Install

```sh
npm i -S @ngrx-utils/{store,effects}
npm i -D @ngrx-utils/cli
# or
yarn add @ngrx-utils/{store,effects}
yarn add -D @ngrx-utils/cli
```

Then include `@ngrx-utils` to your app.module.ts (Only Add this code to your AppModule):

```typescript
import { NgrxUtilsModule } from '@ngrx-utils/store';

@NgModule({
  //...
  imports: [, /* ... */ NgrxUtilsModule]
})
export class AppModule {
  /**
   * BREAKING CHANGES from v0.6.3 to v0.7.0
   * Before:
   *
   * constructor(ngrxSelect: NgrxSelect, store: Store<any>) {
   *   ngrxSelect.connect(store);
   * }
   *
   * After:
   *
   * constructor() {}
   */
}
```

And you can start using `Select, Pluck` decorator in any component. It also works with feature stores too. You don't have to do anything in your feature module. And it work like charm in unit test too. Just need to import NgrxUtilsModule to your `TestBed`

### Example App

* This Example App is a fork of `@ngrx/platform` example app to show you how much boilerplate has been reduce when using `@ngrx-utils`

* [Example App](example-app)

### What's different with ngrx-actions

* Only provide `@Select` decorator. We really feel that the other stuffs from ngrx-actions increase much more boilerplate and lack of type infering when using it in our app.

* No provide string based select with Select decorator, use `@Pluck` instead. Because you can use pipeable operator with `@Select` and it still has correct type inference inside: `@Select(getState, map(a /* 'a' has correct type infer */ => a.b))`

See [changelog](CHANGELOG.md) for latest changes.

## Common Questions

* _Will this work with normal Redux?_ While its designed for Angular and NGRX it would work perfectly fine for normal Redux. If that gets requested, I'll be happy to add better support too.
* _Do I have to rewrite my entire app to use this?_ No, you can use this in combination with the traditional switch statements or whatever you are currently doing.
* _Does it support AoT?_ Yes but see above example for details on implementation.
* _Does this work with NGRX Dev Tools?_ Yes, it does.
* _How does it work with testing?_ Everything should work the same way but don't forget if you use the selector tool to include that in your test runner though.

## ROADMAP to v1

@ngrx-utils/store

* [x] Introduce Pluck decorator for string select
* [x] Select decorator support pipeable operator
* [x] Strong typed pluck operator
* [x] untilDestroy operator
* [x] ngLet directive
* [ ] Web Worker Service to run heavy computing function in Web Worker thread, inspired from: [web-worker.service.ts](https://github.com/Tyler-V/angular-web-workers/blob/master/src/app/fibonacci/web-worker/web-worker.service.ts)
