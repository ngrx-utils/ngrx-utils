import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

export class LetContext<T> {
  $implicit: T | null = null;
  ngLet: T | null = null;
}

@Directive({
  selector: '[ngLet]'
})
export class NgLetDirective<T> {
  private _context = new LetContext<T>();

  @Input()
  set ngLet(value: T) {
    this._context.$implicit = this._context.ngLet = value;
  }

  constructor(_vcr: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
    _vcr.createEmbeddedView(_templateRef, this._context);
  }

  /** @internal */
  public static ngIfUseIfTypeGuard: void;
}
