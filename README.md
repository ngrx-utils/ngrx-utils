# @ngrx-utils

<p align="center">
  <img width="800" alt="@ngrx-utils" src="https://user-images.githubusercontent.com/22189661/36641334-4e67aa84-1a71-11e8-9ac3-d7aff4544788.png">
</p>

[![CircleCI](https://circleci.com/gh/ngrx-utils/ngrx-utils.svg?style=svg)](https://circleci.com/gh/ngrx-utils/ngrx-utils) [![Maintainability](https://api.codeclimate.com/v1/badges/481564ca973db91b89e5/maintainability)](https://codeclimate.com/github/ngrx-utils/ngrx-utils/maintainability) [![codecov](https://codecov.io/gh/ngrx-utils/ngrx-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/ngrx-utils/ngrx-utils) [![Known Vulnerabilities](https://snyk.io/test/github/ngrx-utils/ngrx-utils/badge.svg)](https://snyk.io/test/github/ngrx-utils/ngrx-utils)

Have you ever had a feature request, proposal... and want to have it be implemented in Angular but the Angular team does not accept it for some reasons?

Have you ever built some cool stuffs and want to share but you just don't have time to build your own package, setup test, ci...

Or have you ever feel that the PR process at angular repo is taking too long since the Angular team are busy with their priorities, goals...

I have found that the Angular community has created tons of awesome features and they really want to add it to Angular itself but their PR sometime just end up with a long discussion and then be closed. So I have decided to gather some I found that really handy and include them in this package.

However I just think that why don't we make this repo as a central place like the Angular community Labs to experiment and enjoy all cool stuff the Open Source community has created.

You could modular all handy tips, snippets you have created in a tree shakable way to an NgModule, operators, functions, give some use cases and send a PR here. **I will take care of the documentations, tests and deploy process :))**. Users then can choose whether to use your feature or not, and leave the tree shake job for `@angular/cli`. Yay!!!.

## Quick start

```sh
npm i -S @ngrx-utils/store
# or
yarn add @ngrx-utils/store
```

## What in the box?

### `@Dispatch, @Select & @Pluck` decorator

We often use `store.select` and `store.dispatch` when interacting with `@ngrx/store`, but having to inject `Store<State>` and do all property initialization in every components make me feel some kind of _repeat myself_ too much.

Now, no more `this.prop = this.store.select(/* some prop */)` in your Component, you can use `@Select or @Pluck` decorator instead. And with the `@Dispatch` decorator, we now can completely remove `Store` in component `constructor`.

* `@Select` accepts first parameter as a selector type `(state: any) => any` to select prop from your store (like selectors created with `createSelector` from `@ngrx/store`) and follows up to 8 pipeable operators. You can use operators like `take(1)` to automatically unsubscribe, or transform that value by using `map` and remove selectors for nested properties in store...

* `@Pluck` accepts a list of state property name start from root state. It also supports a 'dot' separated shorthand syntax or use component property name when no argument is specified. Inspired from [ngrx-actions](https://github.com/amcdnl/ngrx-actions) by @amcdnl.

* `@Dispatch` mark your method return result as an action to dispatch from store, so no more `this.store.dispatch(/* ...some action */)`. :)

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
}
```

> Note: Decorator has a limitation is it lack of type checking due to [TypeScript#4881](https://github.com/Microsoft/TypeScript/issues/4881).
>
> You can't use `this` keyword inside `@Select()` to call component's methods because it's not your component instance.

```typescript
/**
 * Won't work.
 */
export class MyNotWorkComponent {
  @Select(
    fromRoot.getRouterState,
    /* `this` here is not your component instance */
    map(state => this.update(state))
  )
  /* if you use `Observable<number>` here TS compiler won't throw an error since decorator lack of type checking */
  url$: Observable<string>;

  update(state: any) {
    /* ... */
  }
}
```

You can using `Select, Pluck, Dispatch` decorator in any component. It also works with lazy load module too. You just need to import NgrxSelectModule **once** to your AppModule and in `TestBed.configureTestingModule` which use to test that component.

### ngLet directive

We often use `*ngIf="stream$ | async as stream"` to subscribe to an observable property and rename it to a template variable.

```html
  <ng-container *ngIf="device$ | async as device">
    <pick-date [registeredAt]="device.registeredAt"</pick-date>
  <ng-container>
```

Consider the following component:

```typescript
@Component({
  selector: 'my-comp',
  template: `
    <pick-date [registeredAt]="(device$ | async)?.registeredAt"
            [firstDate]="(filterDate$ | async)?.from"
            [secondDate]="(filterDate$ | async)?.to"></pick-date>
  `
})
export class MyComponent {
  // these two property are non-related but do have some effect on each other in the UI hierarchy
  @Pluck('device') device$: Observable<Device>;
  @Pluck('filterDate') filterDate$: Observable<FilterDate>;
}
```

Look at filterDate$ property, you have to subscribe to it twice for `firstDate` and `secondDate` binding in `pick-date` component. You definitely don't want that and we can use the above technique to subscribe to it once as below.

```html
    <ng-container *ngIf="(filterDate$ | async) as filterDate">
      <pick-date [registeredAt]="(device$ | async)?.registeredAt"
                [firstDate]="filterDate?.from"
                [secondDate]="filterDate?.to"></pick-date>
    </ng-container>  
```

However the downside of this approach is the template will be removed even when the binding is still fine with values like `null`, `false`, `0`...

What if you have `device !== null` but `filterDate === null`? If filterDate is null, may be it just results as an empty `<input />`. But by using the `*ngIf`, the `pick-date` component will then be completely removed from the page.

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

This way your template display as normal even when filterDate is null. ^^

> Actually this is an feature request in angular for quite long time as described in [here](https://github.com/angular/angular/issues/15280) but not yet been accepted.

### untilDestroy pipeable operator

Have you ever feel odd when have to manually call unsubscribe with subscriptions in `ngOnDestroy`, or even create a Subject property, add takeUntil() to subscription and call `next()` in ngOnDestroy?

Fortunately, we no longer have to do that with untilDestroy pipeable operator. Yay!!!

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

This is just a wrapper function of `rxjs/operators/pluck` but has a nice type checking with plucked property. This is possible now with Typescript >= 2.6.2 which has improved lots of type inference.

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

### Example

* Example code snippet

```typescript
@Component({
  template: `
    <layout *ngLet="loggedIn$ | async as loggedIn">
      <login-form [show]="!loggedIn"></login-form>
    </layout>
  `
})
export class AppComponent {
  @Pluck('layout.showSidenav') showSidenav$: Observable<boolean>;
  @Select(fromAuth.getLoggedIn) loggedIn$: Observable<boolean>;

  constructor() {
    this.showSidenav$.pipe(untilDestroy(this)).subscribe();
  }

  @Dispatch()
  closeSidenav() {
    return new layout.CloseSidenav();
  }

  ngOnDestroy() {}
}
```

* [Example App](example-app): This is a fork of `@ngrx/platform` example app for you to try out your new feature.

## How to contribute

* Fork this repo
* Add your awesome feature and include it in the top level export
* Use it in the example app to see if it work.
* If you kind enough, add some tests and docs to show others how to use it.
* Run `git add . && yarn cz` to automatic generate _Angular style_ commit
* Send a PR here and describe some use cases.

## ROADMAP to v1

@ngrx-utils/store

* [x] Introduce Pluck decorator for string select
* [x] Select decorator support pipeable operator
* [x] Strong typed pluck operator
* [x] untilDestroy operator
* [x] ngLet directive
* [ ] Web Worker Service to run heavy computing function in Web Worker thread, inspired from: [web-worker.service.ts](https://github.com/Tyler-V/angular-web-workers/blob/master/src/app/fibonacci/web-worker/web-worker.service.ts)

@ngrx-utils/effects, @ngrx-utils/cli - No longer been developed
