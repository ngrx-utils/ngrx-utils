import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgrxUtilsModule } from '@ngrx-utils/store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { AddCommasPipe } from '../../shared/pipes/add-commas';
import { EllipsisPipe } from '../../shared/pipes/ellipsis';
import * as book from '../actions/book';
import { BookAuthorsComponent } from '../components/book-authors';
import { BookPreviewComponent } from '../components/book-preview';
import { BookPreviewListComponent } from '../components/book-preview-list';
import { BookSearchComponent } from '../components/book-search';
import * as fromBooks from '../reducers';
import { FindBookPageComponent } from './find-book-page';

describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers)
        }),
        RouterTestingModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        NgrxUtilsModule
      ],
      declarations: [
        FindBookPageComponent,
        BookSearchComponent,
        BookPreviewComponent,
        BookPreviewListComponent,
        BookAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe
      ]
    });

    fixture = TestBed.createComponent(FindBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should dispatch a book.Search action on search', () => {
    const $event: string = 'book name';
    const action = new book.Search($event);

    instance.search($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
