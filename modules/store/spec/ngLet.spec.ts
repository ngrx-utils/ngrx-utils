import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgUtilsModule } from '../src';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  template: '<span *ngLet="test as i">hello{{ i }}</span>',
  selector: 'sand-test'
})
export class TestComponent {
  test$: Observable<number>;
  test = 10;
  nestedTest = 20;
  functionTest = (a: number, b: number) => a + b;
}

@NgModule({
  declarations: [TestComponent],
  imports: [NgUtilsModule, CommonModule],
  exports: [NgUtilsModule, TestComponent]
})
export class TestModule {}

describe('ngLet directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  function getComponent(): TestComponent {
    return fixture.componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  afterEach(() => {
    fixture = null!;
  });

  it(
    'should work in a template attribute',
    async(() => {
      const template = '<span *ngLet="test as i">hello{{ i }}</span>';
      fixture = createTestComponent(template);
      getComponent().test = 7;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1);
      expect(fixture.nativeElement.textContent).toBe('hello7');
    })
  );

  it(
    'should work on a template element',
    async(() => {
      const template = '<ng-template [ngLet]="test" let-i>hello{{ i }}</ng-template>';
      fixture = createTestComponent(template);
      getComponent().test = 5;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('hello5');
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
      expect(fixture.nativeElement.textContent).toBe('hello8');
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
      expect(fixture.nativeElement.textContent).toContain('helloNumber5helloFunction13');
    })
  );

  it(
    'should work on async pipe',
    async(() => {
      const template = '<span *ngLet="test$ | async as t">helloAsync{{ t }}</span>';

      fixture = createTestComponent(template);

      getComponent().test$ = of(15);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1);
      expect(fixture.nativeElement.textContent).toContain('helloAsync15');
    })
  );
});

export function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template } }).createComponent(
    TestComponent
  );
}
