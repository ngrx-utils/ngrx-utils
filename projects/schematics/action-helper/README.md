# Design Action Helper Schematics

## Proposal: https://github.com/ngrx/platform/issues/1075

### 1/ User provide inputs:

```typescript
export enum AuthActionTypes {
  MyAction = '[Feature.HomePage] Do My Action',
  MyAction1 = '[Feature.HomePage] Do My Action 1',
  MyAction2 = '[Feature.HomePage] Do My Action 2',
  MyAction3 = '[Feature.HomePage] Do My Action 3',
  MyAction4 = '[Feature.HomePage] Do My Action 4'
}
```

### 2/ Commands:

```bash
ng generate @ngrx-utils/schematics:action-helper 'projects/example/**/*.actions.ts'
# or
ng g @ngrx-utils/schematics:ah 'projects/example/**/*.actions.ts'
```

### 3/ Outputs:

```typescript
import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  MyAction = '[Feature.HomePage] Do My Action',
  MyAction1 = '[Feature.HomePage] Do My Action 1',
  MyAction2 = '[Feature.HomePage] Do My Action 2',
  MyAction3 = '[Feature.HomePage] Do My Action 3',
  MyAction4 = '[Feature.HomePage] Do My Action 4'
}

/**
 * Generated Actions
 */

export class MyAction implements Action {
  readonly type = AuthActionTypes.MyAction;
}

export class MyAction1 implements Action {
  readonly type = AuthActionTypes.MyAction1;
}

export class MyAction2 implements Action {
  readonly type = AuthActionTypes.MyAction2;
}

export class MyAction3 implements Action {
  readonly type = AuthActionTypes.MyAction3;
}

export class MyAction4 implements Action {
  readonly type = AuthActionTypes.MyAction4;
}

export type AuthActions = MyAction | MyAction1 | MyAction2 | MyAction3 | MyAction4;

/**
 * Optional generate reducer with -r
 */

// test.reducer.ts

import { AuthActions, AuthActionTypes } from './test.actions.ts';

export function authReducer(state, action: AuthActions) {
  switch (action.type) {
    case AuthActionTypes.MyAction:
      return {
        ...state
      };
    case AuthActionTypes.MyAction1:
      return {
        ...state
      };
    case AuthActionTypes.MyAction2:
      return {
        ...state
      };
    case AuthActionTypes.MyAction3:
      return {
        ...state
      };
    case AuthActionTypes.MyAction4:
      return {
        ...state
      };
    default:
      return state;
  }
}
```

Then user can define `constructor(public payload: any) {}`, import types they need for payload, modify the reducer as their wish.

##### Note:

Collect all action types to analyze and provide feedback when user declare not unique action.

### 4/ Scenarios

1/ After user has provided `constructor`, `import`, keep the them as is for next generate.

2/ When user update the `enum` like add new actions or change the name of action type:

- add new action class reflect the enum.
- update union type.
- if `-r` option is specify, create or update the reducer file.

3/ Support multi action enums in 1 file - Generate separate type union for each one. With `-r` option, add multi reducer for each enum as well.

### Implementation

1/ Analyzing enum which has identifier contains 'ActionTypes', get a list of object type `ActionMetadata`

```typescript
export const featureName = 'Auth';

export interface ActionMetadata {
  actionName: string;
  actionType: string;
}
```

Add actionType in to a global map and throw exception if that actionType already exists.

2/ Search through the file to find action class that need to be created

- always recreate action union type.
- add the class that does not present in enum to list to create.
- if `-r` option is specified, add that enum field to list of cases in reducer.

3/ Create class that present in list, create union type with name `AuthActionsUnion`.

4/ Search import statements to see if it needs to add `import { Action } from '@ngrx/store'`:

- add Action to list import if there is no import statement or no import from '@ngrx/store'.
- do nothing when it already has Action in import list.

5/ Insert import to left and Actions to the right of source text.

6/ With `-r`:

- Search path to the reducer to see if it exists.
- Create: Insert import for each type alias and enum. add reducer for each enum and create switch case for each enum field.
- Update: Add new action type into switch case.
