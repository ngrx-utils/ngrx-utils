import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Injectable,
  NgModule,
  ViewChild
} from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { WINDOW } from '@ngrx-utils/store';

@Directive({
  selector: '[sDirective]'
})
class TestDirective {
  constructor(@Inject(WINDOW) public win: any) {}
}

@Component({
  template: `<div sDirective>Test</div>`,
  selector: 'sand-test',
  changeDetection: ChangeDetectionStrategy.OnPush
})
class TestComponent {
  @ViewChild(TestDirective) directive: TestDirective;

  constructor(@Inject(WINDOW) public win: any) {}
}

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(@Inject(WINDOW) public win: any) {}
}

@NgModule({
  declarations: [TestComponent, TestDirective]
})
class TestModule {}

describe('WINDOW', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should success when being injected in Component', () => {
    expect(comp.win).toBeDefined();
  });

  it('should success when being injected in Directive', () => {
    expect(comp.directive).toBeDefined();
    expect(comp.directive.win).toBeDefined();
  });

  it('should success when being injected in Service', inject(
    [TestService],
    (testService: TestService) => {
      expect(testService.win).toBeDefined();
    }
  ));
});
