import { Action } from '@ngrx/store';
import { Book } from '../models/book';

/**
 * Add Book to Collection Actions
 */
export class AddBook implements Action {
  readonly type = '[Collection] Add Book';

  constructor(public payload: Book) {}
}

export class AddBookSuccess implements Action {
  readonly type = '[Collection] Add Book Success';

  constructor(public payload: Book) {}
}

export class AddBookFail implements Action {
  readonly type = '[Collection] Add Book Fail';

  constructor(public payload: Book) {}
}

/**
 * Remove Book from Collection Actions
 */
export class RemoveBook implements Action {
  readonly type = '[Collection] Remove Book';

  constructor(public payload: Book) {}
}

export class RemoveBookSuccess implements Action {
  readonly type = '[Collection] Remove Book Success';

  constructor(public payload: Book) {}
}

export class RemoveBookFail implements Action {
  readonly type = '[Collection] Remove Book Fail';

  constructor(public payload: Book) {}
}

/**
 * Load Collection Actions
 */
export class Load implements Action {
  readonly type = '[Collection] Load';
}

export class LoadSuccess implements Action {
  readonly type = '[Collection] Load Success';

  constructor(public payload: Book[]) {}
}

export class LoadFail implements Action {
  readonly type = '[Collection] Load Fail';

  constructor(public payload: any) {}
}

export type CollectionActions =
  | AddBook
  | AddBookSuccess
  | AddBookFail
  | RemoveBook
  | RemoveBookSuccess
  | RemoveBookFail
  | Load
  | LoadSuccess
  | LoadFail;
