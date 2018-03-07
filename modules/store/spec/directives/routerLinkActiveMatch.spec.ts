import { Component } from '@angular/core';
import { RouterLinkActiveMatchModule } from '@ngrx-utils/store';
import { TestBed, ComponentFixture, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RouterLinkActiveMatch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Test2Component, Test1Component, Test3Component, Test4Component, RootCmp],
      imports: [
        RouterLinkActiveMatchModule,
        RouterTestingModule.withRoutes([
          { path: 'test1', component: Test1Component },
          { path: 'test2', component: Test2Component }
        ])
      ]
    });
  });

  it(
    'should add class to element when route is match',
    fakeAsync(
      inject([Router], (router: Router) => {
        const fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/test1');
        advance(fixture);

        const el = fixture.debugElement.query(By.directive(Test1Component));
        const aTag = el.query(By.css('a'));
        expect(aTag.nativeElement.classList.contains('test1-class')).toBe(true);
      })
    )
  );

  it(
    'should add class to element including origin classes when route is match',
    fakeAsync(
      inject([Router], (router: Router) => {
        const fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/test2');
        advance(fixture);

        const el = fixture.debugElement.query(By.directive(Test2Component));
        const aTag = el.query(By.css('a'));
        expect(aTag.nativeElement.classList.contains('test2-class')).toBe(true);
        expect(aTag.nativeElement.classList.contains('origin-class')).toBe(true);
      })
    )
  );

  it(
    'should remove classes when url not match',
    fakeAsync(
      inject([Router], (router: Router) => {
        const fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/test1');
        advance(fixture);

        const el = fixture.debugElement.query(By.directive(Test3Component));
        const aTag = el.query(By.css('a'));
        expect(aTag.nativeElement.classList.contains('test1-class')).toBe(true);

        router.navigateByUrl('/test2');
        advance(fixture);

        expect(aTag.nativeElement.classList.contains('test1-class')).toBe(false);
        expect(aTag.nativeElement.classList.contains('test2-class')).toBe(true);
      })
    )
  );

  it(
    'should throw error when receive wrong type of value input',
    async(() => {
      const template = `<a [routerLinkActiveMatch]="false">Test4</a>`;
      const fixture = createTestComponent(template);
      expect(() => fixture.detectChanges()).toThrowError();
    })
  );
});

@Component({
  template: `
      <a [routerLinkActiveMatch]="{
          'test1-class': 'test1'
        }">Test1</a>
  `,
  selector: 'test1'
})
class Test1Component {}

@Component({
  template: `
      <a [routerLinkActiveMatch]="{
        'test2-class': 'test2'
      }" class="origin-class">Test2</a>
  `,
  selector: 'test2'
})
class Test2Component {}

@Component({
  template: `<a [routerLinkActiveMatch]="{
    'test2-class': 'test2',
    'test1-class': 'test1'
  }" class="origin-class">Test3</a>`,
  selector: 'test3'
})
class Test3Component {}

@Component({
  template: '',
  selector: 'test4'
})
class Test4Component {}

@Component({
  selector: 'root-cmp',
  template: `<router-outlet></router-outlet><test3></test3>`
})
class RootCmp {}

function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

function createRoot(router: Router, type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  router.initialNavigation();
  advance(f);
  return f;
}

export function createTestComponent(template: string): ComponentFixture<Test4Component> {
  return TestBed.overrideComponent(Test4Component, { set: { template } }).createComponent(
    Test4Component
  );
}
