import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  EventEmitter,
  NgModule,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  ComponentFixtureNoNgZone,
} from '@angular/core/testing';
import { PushPipe, PushPipeModule } from '@ngrx-utils/store';
import { of } from 'rxjs';

class SpyChangeDetectorRef {
  detectChanges() {}
}

@Component({
  template: ` <p>Test {{ test$ | push }}</p> `,
  selector: 'sand-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  test$ = of(2);
}

@NgModule({
  declarations: [TestComponent],
  imports: [PushPipeModule],
})
class TestModule {}

describe('PushPipe', () => {
  describe('Observable', () => {
    let emitter: EventEmitter<any>;
    let pipe: PushPipe;
    let ref: any;
    const message = {};

    beforeEach(() => {
      emitter = new EventEmitter();
      ref = new SpyChangeDetectorRef();
      pipe = new PushPipe(ref);
    });

    describe('transform', () => {
      it('should return null when subscribing to an observable', () => {
        expect(pipe.transform(emitter)).toBe(null);
      });

      it('should return the latest available value', () => {
        pipe.transform(emitter);
        emitter.emit(message);

        setTimeout(() => {
          expect(pipe.transform(emitter)).toEqual(message);
        }, 0);
      });

      it('should return same value when nothing has changed since the last call', () => {
        pipe.transform(emitter);
        emitter.emit(message);

        setTimeout(() => {
          pipe.transform(emitter);
          expect(pipe.transform(emitter)).toBe(message);
        }, 0);
      });

      it('should dispose of the existing subscription when subscribing to a new observable', () => {
        pipe.transform(emitter);

        const newEmitter = new EventEmitter();
        expect(pipe.transform(newEmitter)).toBe(null as any);
        emitter.emit(message);

        // this should not affect the pipe
        setTimeout(() => {
          expect(pipe.transform(newEmitter)).toBe(null as any);
        }, 0);
      });

      it('should request a change detection check upon receiving a new value', () => {
        jest.spyOn(ref, 'detectChanges');
        pipe.transform(emitter);
        emitter.emit(message);

        setTimeout(() => {
          expect(ref.detectChanges).toHaveBeenCalled();
        }, 10);
      });
    });

    describe('ngOnDestroy', () => {
      it('should do nothing when no subscription', () => {
        expect(() => pipe.ngOnDestroy()).not.toThrow();
      });

      it('should dispose of the existing subscription', () => {
        pipe.transform(emitter);
        pipe.ngOnDestroy();
        emitter.emit(message);

        setTimeout(() => {
          expect(pipe.transform(emitter)).toBe(null);
        }, 0);
      });
    });
  });

  describe('Promise', () => {
    const message = new Object();
    let pipe: PushPipe;
    let resolve: (result: any) => void;
    let reject: (error: any) => void;
    let promise: Promise<any>;
    let ref: SpyChangeDetectorRef;
    const timer = 0;

    beforeEach(() => {
      promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      ref = new SpyChangeDetectorRef();
      pipe = new PushPipe(<any>ref);
    });

    describe('transform', () => {
      it('should return null when subscribing to a promise', () => {
        expect(pipe.transform(promise)).toBe(null);
      });

      it('should return the latest available value', () => {
        pipe.transform(promise);

        resolve(message);

        setTimeout(() => {
          expect(pipe.transform(promise)).toEqual(message);
        }, timer);
      });

      it('should return value when nothing has changed since the last call', () => {
        pipe.transform(promise);
        resolve(message);

        setTimeout(() => {
          pipe.transform(promise);
          expect(pipe.transform(promise)).toBe(message);
        }, timer);
      });

      it('should dispose of the existing subscription when subscribing to a new promise', () => {
        pipe.transform(promise);

        promise = new Promise<any>(() => {});
        expect(pipe.transform(promise)).toBe(null);

        resolve(message);

        setTimeout(() => {
          expect(pipe.transform(promise)).toBe(null);
        }, timer);
      });

      it('should request a change detection check upon receiving a new value', () => {
        jest.spyOn(ref, 'detectChanges');
        pipe.transform(promise);
        resolve(message);

        setTimeout(() => {
          expect(ref.detectChanges).toHaveBeenCalled();
        }, timer);
      });

      describe('ngOnDestroy', () => {
        it('should do nothing when no source', () => {
          expect(() => pipe.ngOnDestroy()).not.toThrow();
        });

        it('should dispose of the existing source', () => {
          pipe.transform(promise);
          expect(pipe.transform(promise)).toBe(null);
          resolve(message);

          setTimeout(() => {
            expect(pipe.transform(promise)).toEqual(message);
            pipe.ngOnDestroy();
            expect(pipe.transform(promise)).toBe(null);
          }, timer);
        });
      });
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

  describe('Integration', () => {
    let fixture: ComponentFixture<TestComponent>;
    let instance: TestComponent;
    let debugEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ComponentFixtureNoNgZone, useValue: true }],
      });

      fixture = TestBed.createComponent(TestComponent);
      instance = fixture.componentInstance;
      debugEl = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should render binding properties in template even when ChangeDetectorRef has detached', () => {
      const text = debugEl.query(By.css('p')).nativeElement.textContent;

      expect(text).toBe('Test 2');
    });
  });
});
