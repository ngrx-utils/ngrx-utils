# NgRx Utils [![CircleCI](https://circleci.com/gh/ngrx-utils/ngrx-utils.svg?style=svg)](https://circleci.com/gh/ngrx-utils/ngrx-utils)

This is a library provide utilities function, decorator, directives..., cli tools to help reduce boilerplate and speedup your devs when working with ngrx using class based Action approach.
All these packages will be provide align with @ngrx/platform. For example utilities for `@ngrx/store` will be put under `@ngrx-utils/store` package

Inspired from [ngrx-actions](https://github.com/amcdnl/ngrx-actions) by @amcdnl

## Quick start

```sh
npm i -S @ngrx-utils/{store,effects}
npm i -D @ngrx-utils/cli
# or
yarn add @ngrx-utils/{store,effects}
yarn add -D @ngrx-utils/cli
```

## What in the box

### `@Select & @Pluck` decorator: Pipeable operator all the way

* No more `this.prop = this.store.select(/* some prop */)` in your Component, now you can use `@Select or @Pluck` decorator instead.

* `@Select` decorator is now support pipeable operator => you can use operator like take(1) to automatically unsubscribe or transform that value so you won't need to create more selectors with nested property...

* It accepts first parameter as a selector type `(state: any) => any` to select prop from your store (like selectors created with `createSelector` from `@ngrx/store`) and up to 8 pipeable operators. `@Pluck` is just like `pluck` operator from `rxjs` but it support a 'dot' separated shorthand syntax.

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

### ofAction pipeable operator

#### Why this is better than ofType, default operator from @ngrx/effects?

* It will accept class based actions as parameters. Although ngrx/schematics and ngrx/codegen will give you tools to automatically generate some boilerplate and scaffolding enum action, reducer... for your app, it will also add a fairly large amount lines of code into your codebase by using const or enum to store action type like this:

```typescript
export enum AuthActionType {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
  LoginSuccess = '[Auth] Login Success',
  LoginFail = '[Auth] Login Fail',
  RetrieveAuth = '[Auth] Retrieve Auth',
  RetrieveAuthSuccess = '[Auth] Retrieve Auth Success',
  RetrieveAuthFail = '[Auth] Retrieve Auth Fail'
}
```

* When using ngrx/effect, You will have to cast type to have the correct type checking in the next pipeable operator because ofType only accept string and it cant infer the correct type. This seems acceptable, but sometimes your code look awful when there are 3 or 4 actions with same effects. And things just even worse when you use `import * as fromActions from '../actions'`

```typescript
@Effect()
getCoilItems$ = this.actions$
    .ofType<fromActions.GetEnvItems | fromActions.GetAccItems | fromActions.RefreshEnvItems | fromActions.RefreshAccItems>(
    fromActions.AccActionType.GetAccItems,
    fromActions.AccActionType.RefreshAccItems,
    fromActions.EnvActionType.GetEnvItems,
    fromActions.EnvActionType.RefreshEnvItems,
    )
```

* According to [ngrx/codegen proposal](https://paper.dropbox.com/doc/ngrxcodegen-Proposal-DhD934mmHfqTljpntnqJ3), to have a nice type inference in your effect ofType and get rid of these type casting, ngrx/codegen will use interface base Action, and generate a lookup type, which is includes all action type value:

```typescript
interface LoginAction extends Action {
  type: '[Auth] Login';
  payload: any;
}

/*...*/

export type AuthActions =
  | LoginAction
  | LogoutAction
  | LoginSuccess
  | LoginFail
  | Retrieve
  | RetrieveSuccess
  | RetrieveFail;

export type AuthActionLookup = {
  '[Auth] Login': LoginAction;
  '[Auth] Logout': LogoutAction;
  '[Auth] Login Success': LoginSuccess;
  '[Auth] Login Fail': LoginFail;
  '[Auth] Retrieve Auth': Retrieve;
  '[Auth] Retrieve Auth Success': RetrieveSuccess;
  '[Auth] Retrieve Auth Fail': RetrieveFail;
};
```

This Lookup Type is great but it just like duplicating your action type enum :(. You can see a demo at [https://www.youtube.com/watch?v=Ks-EgpWpcEc](ngAir#144), around from minute 45 ~ 57

* And with all of this, although you will have very nice type inference and static type checking but the trade off is when your app scale up with thousands actions, a **huge** amount of boilerplate will also be generated too. Thanks to `ofAction` pipeable operator, You now can get rid of all those boilerplate and type inference is **just work**. ofAction not only use action class as replace for ofType, but it will also smartly infer all Action type and you won't have to use type cast anymore.

![picture](https://media.giphy.com/media/l49JB9GFcXdLn6vTi/giphy.gif)

* Another nice thing is you can use `action instanceof GetUser` type guard when using class based action, while with interface, you will have to do some thing like `if (action.type === fromActions.AuthActionType.RefreshUsers)`.

### Reducer - VSCode for life saver

* Do I have to type string manually in switch block? Don't worry about it. Thanks to smart infer type of typescript and nice auto completion feature, we now can have auto complete action type without an enum or const.

If you are using VSCode, add this config to your settings to show suggestions within string quote:

```json
"editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
}
```

Then when you type `case ''`, and trigger quick suggestion shortcut `Ctrl + Space`.

![picture](https://media.giphy.com/media/xULW8gMBNukDJQf9ZK/giphy.gif)

### CLI tools

* @ngrx-utils/cli provides an ngrx command to generate all boilerplate for you. All you have to do is just create Action Class declaration file like this:

user.action.ts:

```typescript
import { Action } from '@ngrx/store';

export class GetUsers implements Action {
  readonly type = '[User] Get Users';
  constructor(public payload: string) {}
}

export class RefreshUsers implements Action {
  readonly type = '[User] Refresh Users';
  constructor(public payload: string) {}
}
```

* Then use ngrx command to generate Union Type for you. Optionally you can generate reducer function with `-r` option and all the boilerplate will be nicely formatted with prettier before saving to file.

```sh
# npx ngrx [g | generate] [a | action] [-r | --reducer true] path/to/action
npx ngrx g a -r true path/to/user.action.ts
```

* This will generate `user.action.helper.ts` in the same folder with `user.action.ts`

```typescript
import { GetUsers, RefreshUsers } from './user.action';

export type UserActions = GetUsers | RefreshUsers;

// with -r true option
export function userReducer(state: any, action: UserActions): any {
case '[User] Get User':
    return {
    ...state
    };
case '[User] Refresh User':
    return {
    ...state
    };
default:
    return state;
}
```

> This command actually is a modified version of @ngrx/codegen to accept class base action.

## Getting Started

### Install

```sh
npm i -S @ngrx-utils/{store,effects}
npm i -D @ngrx-utils/cli
# or
yarn add @ngrx-utils/{store,effects}
yarn add -D @ngrx-utils/cli
```

Then in your app.module.ts (Only Add this code to your AppModule), connect ngrx-utils to your store:

```typescript
import { NgrxSelect, NgrxUtilsModule } from '@ngrx-utils/store';
import { Store } from '@ngrx/store';

@NgModule({
  //...
  imports: [, /* ... */ NgrxUtilsModule]
})
export class AppModule {
  constructor(ngrxSelect: NgrxSelect, store: Store<any>) {
    ngrxSelect.connect(store);
  }
}
```

And you can start using it in any component. It also works with feature stores too. You don't have to do anything in your feature module. Don't forget to invoke the `connect` function when you are writing tests.

### Select & Pluck decorator

`@Select` decorator accept a selector as first parameter, and then pipeable operators just like `Observable.pipe()`

```typescript
import { Select, Pluck } from '@ngrx-utils/store';
import { map } from 'rxjs/operators';

export class MyComponent {
  /** use property name when there is no specified
   * same as this.myFeature = store.select('myFeature')
   */
  @Pluck() myFeature: Observable<any>;

  /* does same way as store.select('myFeature', 'anotherProp') */
  @Pluck('myFeature', 'anotherProp')
  anotherProp: Observable<any>;

  /* shorthand syntax but same as above */
  @Pluck('myFeature.anotherProp') anotherProp: Observable<any>;

  /* use selectors composed by createSelector */
  @Select(fromStore.getMyWifeProp) myWifeProp: Observable<Dangerous | null>;

  /* use pipeable operator to transform data */
  @Select(fromStore.getMyWifeProp, map(a => !!a))
  isMyWife: Observable<boolean>;
}
```

### ofAction

* You can use ofAction operator instead of ofType to filter your Action type in Effect:

```typescript
import { ofAction } from '@ngrx-utils/effects';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { RouterGo } from '../../rootStore';

import { GetUser, RefreshUser, GetUserSuccess, GetUserFail } from '../actions';

@Injectable()
export class MyEffects {
  constructor(private actions$: Actions, private myService: MyService) {}

  @Effect()
  getUser$ = this.actions$.pipe(
    ofAction(GetUser, RefreshUser),
    /* dont have to cast action type when there are multi actions */
    switchMap((action) /* GetUser | RefreshUser */ =>
      this.myService
        .getAll(action.payload)
        .pipe(map(res => new GetUserSuccess(res)), catchError(err => of(new GetUserFail(err)))))
  );

  @Effect()
  getUserSuccess$ = this.actions$.pipe(
    ofAction(GetUserSuccess),
    /* automatically infer GetUserSuccess action type */
    map(action => new RouterGo({ path: [action.payload] }))
  );
}
```

### Example App

* This Example App is a fork of `@ngrx/platform` example app to show you how much boilerplate has been reduce when using `@ngrx-utils`

* [Example App](example-app)

### What's different with ngrx-actions

* Only provide `@Select` and `ofAction` pipeable operator. We really feel that `@Store`, `createReducer` and `@Action` from ngrx-actions increase much more boilerplate when using it in our app.

* No provide deep nested prop API with Select decorator. Typescript cannot infer correct type in future decorator support.

* Better type inference with ofAction pipeable operator.

See [changelog](CHANGELOG.md) for latest changes.

## Common Questions

* _Will this work with normal Redux?_ While its designed for Angular and NGRX it would work perfectly fine for normal Redux. If that gets requested, I'll be happy to add better support too.
* _Do I have to rewrite my entire app to use this?_ No, you can use this in combination with the traditional switch statements or whatever you are currently doing.
* _Does it support AoT?_ Yes but see above example for details on implementation.
* _Does this work with NGRX Dev Tools?_ Yes, it does.
* _How does it work with testing?_ Everything should work the same way but don't forget if you use the selector tool to include that in your test runner though.

## ROADMAP to v1

@ngrx-utils/cli

* [x] Provide basic ngrx command
* [ ] Use a config file to store all module action, reducer... declaration file path to continuous update and optimize your store when your app scale up
* [ ] Use schematics to scaffolding the full store implement best practices.

@ngrx-utils/store

* [x] Introduce Pluck decorator for string select
* [x] Select decorator support pipeable operator
* [ ] Investigate using store in Web Worker for large Entities, inspired from [Stockroom](https://github.com/developit/stockroom). Example implement Web Worker Service in Angular: [web-worker.service.ts](https://github.com/Tyler-V/angular-web-workers/blob/master/src/app/fibonacci/web-worker/web-worker.service.ts)

@ngrx-utils/effects

* [x] Have better way to filter action instead of calling new Action().type.
