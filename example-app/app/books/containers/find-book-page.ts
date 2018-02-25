import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Select, Dispatch } from '@ngrx-utils/store';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import * as fromBooks from '../reducers';
import * as book from '../actions/book';
import { Book } from '../models/book';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search [query]="searchQuery$ | async" [searching]="loading$ | async" [error]="error$ | async" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `
})
export class FindBookPageComponent {
  @Select(fromBooks.getSearchQuery, take(1))
  searchQuery$: Observable<string>;
  @Select(fromBooks.getSearchResults) books$: Observable<Book[]>;
  @Select(fromBooks.getSearchLoading) loading$: Observable<boolean>;
  @Select(fromBooks.getSearchError) error$: Observable<string>;

  constructor(private store: Store<fromBooks.State>) {}

  @Dispatch()
  search(query: string) {
    return new book.Search(query);
  }
}
