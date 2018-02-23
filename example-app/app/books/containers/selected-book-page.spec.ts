import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedBookPageComponent } from './selected-book-page';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';
import { NgrxUtilsModule } from '@ngrx-utils/store';

import * as collection from '../actions/collection';
import * as fromBooks from '../reducers';
import { BookDetailComponent } from '../components/book-detail';
import { Book, generateMockBook } from '../models/book';
import { BookAuthorsComponent } from '../components/book-authors';
import { AddCommasPipe } from '../../shared/pipes/add-commas';

describe('Selected Book Page', () => {
  let fixture: ComponentFixture<SelectedBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: SelectedBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers)
        }),
        MatCardModule,
        NgrxUtilsModule
      ],
      declarations: [
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe
      ]
    });

    fixture = TestBed.createComponent(SelectedBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should dispatch a collection.AddBook action when addToCollection is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const $event: Book = generateMockBook();
    const action = new collection.AddBook($event);

    instance.addToCollection($event);

    expect(spy).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a collection.RemoveBook action on removeFromCollection', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const $event: Book = generateMockBook();
    const action = new collection.RemoveBook($event);

    instance.removeFromCollection($event);

    expect(spy).toHaveBeenLastCalledWith(action);
  });
});
