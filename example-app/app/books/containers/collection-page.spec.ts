import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgrxUtilsModule } from '@ngrx-utils/store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { AddCommasPipe } from '../../shared/pipes/add-commas';
import { EllipsisPipe } from '../../shared/pipes/ellipsis';
import * as collection from '../actions/collection';
import { BookAuthorsComponent } from '../components/book-authors';
import { BookPreviewComponent } from '../components/book-preview';
import { BookPreviewListComponent } from '../components/book-preview-list';
import * as fromBooks from '../reducers';
import { CollectionPageComponent } from './collection-page';

describe('Collection Page', () => {
  let fixture: ComponentFixture<CollectionPageComponent>;
  let store: Store<fromBooks.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers)
        }),
        MatCardModule,
        MatInputModule,
        RouterTestingModule,
        NgrxUtilsModule
      ],
      declarations: [
        CollectionPageComponent,
        BookPreviewListComponent,
        BookPreviewComponent,
        BookAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe
      ]
    });

    fixture = TestBed.createComponent(CollectionPageComponent);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should dispatch a collection.Load on init', () => {
    const action = new collection.Load();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
