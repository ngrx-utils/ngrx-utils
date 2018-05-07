# @ngrx-utils [![CircleCI](https://circleci.com/gh/ngrx-utils/ngrx-utils.svg?style=svg)](https://circleci.com/gh/ngrx-utils/ngrx-utils) [![Maintainability](https://api.codeclimate.com/v1/badges/481564ca973db91b89e5/maintainability)](https://codeclimate.com/github/ngrx-utils/ngrx-utils/maintainability) [![codecov](https://codecov.io/gh/ngrx-utils/ngrx-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/ngrx-utils/ngrx-utils) [![Known Vulnerabilities](https://snyk.io/test/github/ngrx-utils/ngrx-utils/badge.svg)](https://snyk.io/test/github/ngrx-utils/ngrx-utils)

<p align="center">
  <img width="800" alt="@ngrx-utils" src="https://user-images.githubusercontent.com/22189661/39393274-3b89231c-4afe-11e8-92a3-79d09716db03.png">
</p>

<h1 align="center">Reusable logic library for Angular application</h1>
<h2 align="center">Built with @angular/bazel</h2>

## Quick start

```sh
npm i -S @ngrx-utils/store
# or
yarn add @ngrx-utils/store
```

## What in the box?

### routerLinkMatch directive

This directive will give you ability to add a class to the element when router url match a regular expression. The syntax is same with `ngClass` but replace the true/false expression with your string based regexp (like the string you pass to `new RegExp('')`).

Example: `active-class` will be added to `a` tag when router URL contains this segment: `products/12345`

```html
<a routerLink="/products"
   [routerLinkMatch]="{
     "active-class": "products/\\d+"
   }"></a>
```

### push pipe

This is a modified version of async pipe in @angular/common package. All the code implement are almost the same but this push pipe will call `detectChanges()` instead of `markForCheck()` so your pipe continue to work even in `{ngZone: 'noop'}` environment.

```typescript
// main.ts
platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch(err => console.log(err));

// app.module.ts
import { PushPipeModule } from '@ngrx-utils/store';
@NgModule({
  declarations: [SomeComponent],
  imports: [PushPipeModule]
})
export class AppModule {}
// heavy-compute.component.ts
import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  template: `<h2>Test: {{ test$ | push }}</h2>`
})
export class SomeComponent implements OnInit {
  test$: Observable<any>;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.test$ = this.http.get(/* get data */);
  }
}
```

### ngLet directive

We often use `*ngIf="stream$ | async as stream"` to subscribe to an observable property and rename it to a template variable. But with nested template, `*ngIf` might remove your template which may not be expected.

#### NgLet to rescue:

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
                    [firstDate]="filterDate?.from"
                    [secondDate]="filterDate?.to"></pick-date>
    </ng-container>
```

`*ngLet` just hold a reference to the result of `async` pipe in a template variable and don't have any special logic like structure directives such as `*ngIf` or `*ngFor` so it run faster and very handy.

You can also subscribe to multiple observable separately with `*ngLet` like this:

```html
    <ng-container *ngLet="{
        device: device$ | async,
        date: filterDate$ | async
      } as options">
      <pick-date [registeredAt]="options.device?.registeredAt"
                    [firstDate]="options.date?.from"
                    [secondDate]="options.date?.to"></pick-date>
    </ng-container>
```

> Actually this is an feature request in angular for quite long time as described in [here](https://github.com/angular/angular/issues/15280) but not yet been accepted.

### untilDestroy pipeable operator

Have you ever feel odd when have to repeat calling unsubscribe with subscriptions in `ngOnDestroy`, or creating a Subject property, add takeUntil() to subscription, call `next()` in ngOnDestroy?

With untilDestroy pipeable operator:

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

> NOTE: You still have to declare `ngOnDestroy` in Component because Angular does not support dynamically add component method in AOT mode

> Credit to @SanderElias, this operator is inspired from his idea but he's currently not publishing it as an npm package.

### Strong type `pluck` operator

This is just a wrapper function of `rxjs/operators/pluck` but has a nice type checking with plucked properties.

```typescript
import { pluck } from '@ngrx-utils/store';

someObservable
  /** Type check here */
  .pipe(pluck('matches'));
```

![picture](https://media.giphy.com/media/3ohs4yQkU3hYGLl3Tq/giphy.gif)

### `@Dispatch, @Select & @Pluck` decorator

Shorter store.select and store.dispatch and you don't have to inject store in to your component anymore.

* `@Select` accepts first parameter as a selector type `(state: any) => any` to select prop from your store (like selectors created with `createSelector` from `@ngrx/store`) and follows up to 8 pipeable operators. You can use operators like `take(1)` to automatically unsubscribe, or transform that value by using `map` and reduce selectors for nested properties in store...

* `@Pluck` accepts a list of state property name start from root state. It also supports a 'dot' separated shorthand syntax or use component property name when no argument is specified. Inspired from [ngrx-actions](https://github.com/amcdnl/ngrx-actions) by @amcdnl.

* `@Dispatch` mark your method return result as an action to dispatch from store. You can also return an array of actions if you want to dispatch multi actions in 1 method.

```typescript
// app.module.ts
import { NgrxSelectModule } from '@ngrx-utils/store';

@NgModule({
  // Include `NgrxSelectModule` to your app.module.ts (Only add this to your AppModule):
  imports: [, /* ... */ NgrxSelectModule]
})
export class AppModule {}

// my.component.ts
import { take, map } from 'rxjs/operators';
import { Select, Pluck, Dispatch } from '@ngrx-utils/store';

@Component({
  template: ``
})
export class MyComponent {
  @Select(fromRoot.getRouterState, map(state => state.url), take(1))
  url$: Observable<string>;

  @Pluck('featureState', 'prop1')
  prop1: Observable<any>;

  @Pluck('featureState.prop2') prop2: Observable<any>;

  @Pluck() featureState: Observable<any>;

  @Dispatch()
  onLayoutChanged($event) {
    return new SetLayout($event);
  }

  @Dispatch()
  onMultiAction() {
    return [new SetLanguage(), new Navigate('/home')];
  }
}
```

This feature **DO** come with a trade-off: it lacks of type checking for your component properties due to [Typescript issue #4881](https://github.com/Microsoft/TypeScript/issues/4881).

So please keep it in your mind when using `@Select` or `@Pluck`. `@Dispatch` is safe to use though. Hopefully Typescript team will fix that issue in the near future.

**NOTE**: You can **NOT** use `this` keyword inside `@Select()` to call component's methods because `this` using in `@Select()` is not your component instance.

You can using `Select, Pluck, Dispatch` decorator in any component. It also works with lazy load module too. You only need to import NgrxSelectModule once to your AppModule and in `TestBed.configureTestingModule` when running tests.

## How to contribute

* Fork this repo
* Add your awesome feature and include it in the top level export
* Run `git add . && yarn cz` to automatic generate _Angular style_ commit
* Send a PR here and describe some use cases.

## ROADMAP to v1

@ngrx-utils/store

* [x] Introduce Pluck decorator for string select
* [x] Select decorator support pipeable operator
* [x] Strong typed pluck operator
* [x] untilDestroy operator
* [x] ngLet directive
* [x] routerLinkMatch directive

@ngrx-utils/schematics

* [ ] ngrx-utils schematics for union Action type and Enum.

@ngrx-utils/effects, @ngrx-utils/cli - No longer been developed.
