import { Action } from '@ngrx/store';
import { Book } from '../models/book';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = '[Book] Search';

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = '[Book] Search Complete';

  constructor(public payload: Book[]) {}
}

export class SearchError implements Action {
  readonly type = '[Book] Search Error';

  constructor(public payload: string) {}
}

export class Load implements Action {
  readonly type = '[Book] Load';

  constructor(public payload: Book) {}
}

export class Select implements Action {
  readonly type = '[Book] Select';

  constructor(public payload: string) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type BookActions = Search | SearchComplete | SearchError | Load | Select;
