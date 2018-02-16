import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';

import { NgUtilsModule } from '../src';

@Component({
  template: '<span *ngLet="test as i">hello{{ i }}</span>',
  selector: 'sand-test'
})
export class TestComponent {
  test$ = new Subject<number>();
  test = 10;
  nestedTest = 20;
  functionTest = (a: number, b: number) => a + b;
}

@NgModule({
  declarations: [TestComponent],
  imports: [NgUtilsModule],
  exports: [NgUtilsModule, TestComponent]
})
export class TestModule {}

describe('ngLet directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  function getComponent(): TestComponent {
    return fixture.componentInstance;
  }

  afterEach(() => {
    fixture = null!;
  });

  beforeEach(
    async(() => {
      debugger;
      TestBed.configureTestingModule({
        imports: [TestModule]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    })
  );

  it(
    'should work in a template attribute',
    async(() => {
      const template = '<span *ngLet="test as i">hello{{ i }}</span>';
      fixture = createTestComponent(template);
      getComponent().test = 7;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1);
      expect(fixture.nativeElement).toContain('hello7');
    })
  );

  it(
    'should work on a template element',
    async(() => {
      const template = '<ng-template [ngLet]="test" let-i>hello{{ i }}</ng-template>';
      fixture = createTestComponent(template);
      getComponent().test = 5;
      fixture.detectChanges();
      expect(fixture.nativeElement).toContain('hello5');
    })
  );

  it(
    'should handle nested ngLet correctly',
    async(() => {
      const template =
        '<div *ngLet="test as i"><span *ngLet="nestedTest as k">hello{{ i + k }}</span></div>';

      fixture = createTestComponent(template);

      getComponent().test = 3;
      getComponent().nestedTest = 5;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1);
      expect(fixture.nativeElement).toContain('hello8');
    })
  );

  it(
    'should update several nodes',
    async(() => {
      const template =
        '<span *ngLet="test + 1; let i">helloNumber{{ i }}</span>' +
        '<span *ngLet="functionTest(5, 8) as j">helloFunction{{ j }}</span>';

      fixture = createTestComponent(template);

      getComponent().test = 4;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(2);
      expect(fixture.nativeElement).toContain('helloNumber5');
      expect(fixture.nativeElement).toContain('helloFunction13');
    })
  );
});

export function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template } }).createComponent(
    TestComponent
  );
}
