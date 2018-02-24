# @ngrx-utils

[![CircleCI](https://circleci.com/gh/ngrx-utils/ngrx-utils.svg?style=svg)](https://circleci.com/gh/ngrx-utils/ngrx-utils) [![Maintainability](https://api.codeclimate.com/v1/badges/481564ca973db91b89e5/maintainability)](https://codeclimate.com/github/ngrx-utils/ngrx-utils/maintainability) [![codecov](https://codecov.io/gh/ngrx-utils/ngrx-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/ngrx-utils/ngrx-utils) [![Known Vulnerabilities](https://snyk.io/test/github/ngrx-utils/ngrx-utils/badge.svg)](https://snyk.io/test/github/ngrx-utils/ngrx-utils)

Have you ever had a feature request, proposal... and want to have it be implemented in Angular but the Angular team does not accept it for some reasons?

Have you ever built some cool stuffs and want to share but you just don't have time to build your own package, setup test, ci...

Or have you ever feel that the PR process at angular repo is taking too long since the Angular team are busy with their priorities, goals...

I have found that the Angular community has created tons of awesome features in Angular and they really want to add it to Angular itself but their PR sometime just end up with a long discussion and then be closed. Instead you could modular it in a tree shakable way to an NgModule, operators, functions, create some tests, documents and send an PR here. **It will be accepted**. Users then can choose whether to use your feature or not, and leave the tree shake job for `@angular/cli`.

## Quick start

```sh
npm i -S @ngrx-utils/store
# or
yarn add @ngrx-utils/store
```

## What in the box?

### ngLet directive

* Do you find yourself often use `*ngIf="stream$ | async as stream" to subscribe to an observable property and rename it to a template variable? The downside of this approach is the template will be removed even when you really want to use the value`false`,`0`... or when you use 2 non-related observable property nested in template like this:

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
    // these two property are non-related but do have some effect on each other in your UI
    this.device$ = store.select('device');
    this.filterDate$ = store.select('filterDate');
  }
}
```

* Look at filterDate$ property, you have to subscribe to it twice for firstDate and secondDate binding in `pick-date` component if you use normal approach.

```html
      <pick-date [registeredAt]="(device$ | async)?.registeredAt"
                    (reloadItems)="onReloadTruckItems($event)"
                    [firstDate]="(filterDate$ | async)?.from"
                    [secondDate]="(filterDate$ | async)?.to"
                    (loadItems)="onLoadTruckItems($event)"></pick-date>
```

So you have to wrap template by `ng-container` and subscribe to it once as above. Unfortunately there was another binding needed is `[registerAt]` on pick-date component and it's only available by `device.registerAt`.

What if you have `device !== null` but `filterDate === null` (If filterDate is null, may be it will just result as an empty input of a form)? The `pick-date` component will then be completely removed from the page.

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

* Actually this is an feature request in angular for quite long time as described in [here](https://github.com/angular/angular/issues/15280) but not yet been accepted.

### untilDestroy pipeable operator

* Ever feel odd when have to manually call unsubscribe with observable in `ngOnDestroy`, or have to create a Subject property in every component?

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

### Strong type `pluck` operator

* This is a wrapper function of `rxjs/operators/pluck` which has a nice type checking with plucked property. This was not possible before but now it can with typescript >= 2.6.2 which has improved a lot of type inference.

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
// app.module.ts
import { NgrxSelectModule } from '@ngrx-utils/store';

@NgModule({
  // Include `NgrxSelectModule` to your app.module.ts (Only add this to your AppModule):
  imports: [, /* ... */ NgrxSelectModule]
})
export class AppModule {}

// my.component.ts
import { take, map } from 'rxjs/operators';
import { Select, Pluck } from '@ngrx-utils/store';

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
 * Won't work.
 */
export class MyNotWorkComponent {
  @Select(
    fromRoot.getRouterState,
    /* `this` here is a global object */

    map(state => this.update(state))
  )
  url$: Observable<string>;
  /* if you use `Observable<number>` here TS compiler won't throw an error since decorator lack of type checking */

  update(state: any) {
    /* ... */
  }
}
```

You can using `Select, Pluck` decorator in any component. It also works with feature stores too. You don't have to do anything in your feature module. And it work like charm in unit test too. Just need to import NgrxSelectModule to your `TestBed`

### Example App

* This Example App is a fork of `@ngrx/platform` example app for you to try out your new feature.

* [Example App](example-app)

## How to contribute

* Fork this repo
* Add your awesome feature
* Please do add some tests and docs to show others how to use it
* Run `git add . && yarn cz` to automatic generate _Angular style_ commit
* Try to build it with `yarn build`
* Send a PR here.

## ROADMAP to v1

@ngrx-utils/store

* [x] Introduce Pluck decorator for string select
* [x] Select decorator support pipeable operator
* [x] Strong typed pluck operator
* [x] untilDestroy operator
* [x] ngLet directive
* [ ] Web Worker Service to run heavy computing function in Web Worker thread, inspired from: [web-worker.service.ts](https://github.com/Tyler-V/angular-web-workers/blob/master/src/app/fibonacci/web-worker/web-worker.service.ts)

@ngrx-utils/effects, @ngrx-utils/cli - No longer been developed
