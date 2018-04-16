import { EventEmitter, WrappedValue } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { PushPipe } from '@ngrx-utils/store';

import { AsyncTestCompleter, SpyChangeDetectorRef } from './helpers';

describe('PushPipe', () => {
  describe('Observable', () => {
    let emitter: EventEmitter<any>;
    let pipe: PushPipe;
    let ref: any;
    const message = {};

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [AsyncTestCompleter]
      });
      emitter = new EventEmitter();
      ref = new SpyChangeDetectorRef();
      pipe = new PushPipe(ref);
    });

    describe('transform', () => {
      it('should return null when subscribing to an observable', () => {
        expect(pipe.transform(emitter)).toBe(null);
      });

      it(
        'should return the latest available value wrapped',
        inject([AsyncTestCompleter], (asyncTestCompleter: AsyncTestCompleter) => {
          pipe.transform(emitter);
          emitter.emit(message);

          // setTimeout(() => {
          expect(pipe.transform(emitter)).toEqual(new WrappedValue(message));
          asyncTestCompleter.done();
          // }, 0);
        })
      );

      it(
        'should return same value when nothing has changed since the last call',
        inject([AsyncTestCompleter], (asyncTestCompleter: AsyncTestCompleter) => {
          pipe.transform(emitter);
          emitter.emit(message);

          // setTimeout(() => {
          pipe.transform(emitter);
          expect(pipe.transform(emitter)).toBe(message);
          asyncTestCompleter.done();
          // }, 0);
        })
      );

      it(
        'should dispose of the existing subscription when subscribing to a new observable',
        inject([AsyncTestCompleter], (asyncTestCompleter: AsyncTestCompleter) => {
          pipe.transform(emitter);

          const newEmitter = new EventEmitter();
          expect(pipe.transform(newEmitter)).toBe(null as any);
          emitter.emit(message);

          // this should not affect the pipe
          setTimeout(() => {
            expect(pipe.transform(newEmitter)).toBe(null as any);
            asyncTestCompleter.done();
          }, 0);
        })
      );

      it(
        'should request a change detection check upon receiving a new value',
        inject([AsyncTestCompleter], (asyncTestCompleter: AsyncTestCompleter) => {
          pipe.transform(emitter);
          emitter.emit(message);

          // setTimeout(() => {
          expect(ref.spy('detectChanges')).toHaveBeenCalled();
          asyncTestCompleter.done();
          // }, 10);
        })
      );
    });

    describe('ngOnDestroy', () => {
      it('should do nothing when no subscription', () => {
        expect(() => pipe.ngOnDestroy()).not.toThrow();
      });

      it(
        'should dispose of the existing subscription',
        inject([AsyncTestCompleter], (asyncTestCompleter: AsyncTestCompleter) => {
          pipe.transform(emitter);
          pipe.ngOnDestroy();
          emitter.emit(message);

          /**
           * Work around for jasmine 3 not allowing non direct `expect` in `it` block
           */
          expect(true).toBe(true);
          setTimeout(() => {
            expect(pipe.transform(emitter)).toBe(null);
            asyncTestCompleter.done();
          }, 0);
        })
      );
    });
  });

  describe('null', () => {
    it('should return null when given null', () => {
      const pipe = new PushPipe(null as any);
      expect(pipe.transform(null as any)).toEqual(null);
    });
  });

  describe('other types', () => {
    it('should throw when given an invalid object', () => {
      const pipe = new PushPipe(null as any);
      expect(() => pipe.transform(<any>'some bogus object')).toThrowError();
    });
  });
});
