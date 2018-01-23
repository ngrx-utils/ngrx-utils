import { Injectable } from '@angular/core';
import { ofAction } from '@ngrx-utils/effects';
import { Database } from '@ngrx/db';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap, switchMap, toArray } from 'rxjs/operators';

import { Book } from '../models/book';
import {
  AddBook,
  AddBookFail,
  AddBookSuccess,
  Load,
  LoadFail,
  LoadSuccess,
  RemoveBook,
  RemoveBookFail,
  RemoveBookSuccess
} from './../actions/collection';

@Injectable()
export class CollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('books_app');
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$.pipe(
    ofAction(Load),
    switchMap(() =>
      this.db
        .query('books')
        .pipe(toArray(), map((books: Book[]) => new LoadSuccess(books)), catchError(error => of(new LoadFail(error))))
    )
  );

  @Effect()
  addBookToCollection$: Observable<Action> = this.actions$.pipe(
    ofAction(AddBook),
    map(action => action.payload),
    mergeMap(book =>
      this.db
        .insert('books', [book])
        .pipe(map(() => new AddBookSuccess(book)), catchError(() => of(new AddBookFail(book))))
    )
  );

  @Effect()
  removeBookFromCollection$: Observable<Action> = this.actions$.pipe(
    ofAction(RemoveBook),
    map(action => action.payload),
    mergeMap(book =>
      this.db
        .executeWrite('books', 'delete', [book.id])
        .pipe(map(() => new RemoveBookSuccess(book)), catchError(() => of(new RemoveBookFail(book))))
    )
  );

  constructor(private actions$: Actions, private db: Database) {}
}
