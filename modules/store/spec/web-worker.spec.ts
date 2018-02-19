import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WebWorkerService } from '../src';

import { NgModule, Component } from '@angular/core';

@Component({
  selector: 'test-comp',
  template: ''
})
class TestComponent {
  data: number[];
  constructor(private webWorker: WebWorkerService) {}

  async testMethod() {
    this.data = await this.webWorker.run<number[]>(() => {
      const result: number[] = [];
      for (let i = 0; i < 10; i++) {
        result.push(i);
      }
      return result;
    });
  }
}

@NgModule({
  declarations: [TestComponent],
  providers: [WebWorkerService]
})
export class TestModule {}

describe('WebWorkerService', () => {
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  it('should create component with web worker service', () => {
    fixture = TestBed.createComponent(TestComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
