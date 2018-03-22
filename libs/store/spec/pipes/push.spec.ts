import { Component, NgModule, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PushPipeModule } from '@ngrx-utils/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  template: '',
  selector: 'sand-test'
})
class TestComponent {
  test$: Observable<number>;
  test = 10;
  nestedTest = 20;
  functionTest = (a: number, b: number) => a + b;

  constructor(cdr: ChangeDetectorRef) {
    cdr.detach();
  }
}

@NgModule({
  declarations: [TestComponent],
  imports: [PushPipeModule, CommonModule]
})
class TestModule {}

describe('push pipe', () => {
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
});

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template } }).createComponent(
    TestComponent
  );
}
