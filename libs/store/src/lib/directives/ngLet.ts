import {
  NgModule,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

export class NgLetContext<T = any> {
  $implicit: T | null = null;
  ngLet: T | null = null;
}

@Directive({
  selector: '[ngLet]',
})
export class NgLetDirective<T = any> implements OnInit {
  private _context: NgLetContext<T> = new NgLetContext<T>();

  @Input()
  set ngLet(value: T | null) {
    this._context.$implicit = this._context.ngLet = value;
  }

  constructor(
    private _vcr: ViewContainerRef,
    private _templateRef: TemplateRef<NgLetContext<T>>
  ) {}

  ngOnInit() {
    this._vcr.createEmbeddedView(this._templateRef, this._context);
  }

  /** @internal */
  public static ngLetUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `NgLet` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `NgLet` structural directive renders its template, the type of the expression bound
   * to `NgLet` should be narrowed in some way. For `NgLet`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgLet`.
   */
  static ngTemplateGuard_ngLet: 'binding';

  /**
   * Asserts the correct type of the context for the template that `NgLet` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgLet` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T>(
    dir: NgLetDirective<T>,
    ctx: any
  ): ctx is NgLetContext<Exclude<T, false | 0 | '' | null | undefined>> {
    return true;
  }
}

@NgModule({
  declarations: [NgLetDirective],
  exports: [NgLetDirective],
})
export class NgLetModule {}
