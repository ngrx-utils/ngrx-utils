import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Select, Dispatch } from '@ngrx-utils/store';

import * as fromBooks from '../reducers';
import * as collection from '../actions/collection';
import { Book } from '../models/book';

@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `
})
export class SelectedBookPageComponent {
  @Select(fromBooks.getSelectedBook) book$: Observable<Book>;
  @Select(fromBooks.isSelectedBookInCollection) isSelectedBookInCollection$: Observable<boolean>;

  @Dispatch()
  addToCollection(book: Book) {
    return new collection.AddBook(book);
  }

  @Dispatch()
  removeFromCollection(book: Book) {
    return new collection.RemoveBook(book);
  }
}
