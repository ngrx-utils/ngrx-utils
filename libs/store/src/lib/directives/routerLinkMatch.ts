import { ContentChildren, Directive, Input, NgModule } from '@angular/core';
import type {
  QueryList,
  AfterContentInit,
  ElementRef,
  OnChanges,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkWithHref,
} from '@angular/router';
import { untilDestroy } from '../operators';

export interface MatchExp {
  [classes: string]: string;
}

/**
 * This directive will give you ability to add a class to the element
 * when router url match a regular expression.
 * The syntax is same with ngClass but replace the true/false expression
 * with your string based regexp (like the string you pass to new RegExp(''))
 *
 * @example
 * Example: active-class will be added to a tag when router URL
 * contains this segment: products/12345
 *
 * ```html
 * <a routerLink="/products"
 *  [routerLinkMatch]="{
 *    "active-class": "products/\\d+"
 *  }"></a>
 * ```
 */
@Directive({
  selector: '[routerLinkMatch]',
})
export class RouterLinkMatch implements OnDestroy, OnChanges, AfterContentInit {
  private _curRoute: string;
  private _matchExp: MatchExp;

  @ContentChildren(RouterLink, { descendants: true })
  links: QueryList<RouterLink>;

  @ContentChildren(RouterLinkWithHref, { descendants: true })
  linksWithHrefs: QueryList<RouterLinkWithHref>;

  @Input('routerLinkMatch')
  set routerLinkMatch(matchExp: MatchExp) {
    if (matchExp && typeof matchExp === 'object') {
      this._matchExp = matchExp;
    } else {
      throw new TypeError(
        `Unexpected type '${typeof matchExp}' of value for ` +
          `input of routerLinkMatch directive, expected 'object'`
      );
    }
  }

  constructor(
    private router: Router,
    private _renderer: Renderer2,
    private _ngEl: ElementRef
  ) {
    router.events.pipe(untilDestroy(this)).subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this._curRoute = (e as NavigationEnd).urlAfterRedirects;
        this._update();
      }
    });
  }

  ngOnChanges() {
    this._update();
  }

  ngAfterContentInit() {
    this.links.changes.pipe(untilDestroy(this)).subscribe(() => this._update());
    this.linksWithHrefs.changes
      .pipe(untilDestroy(this))
      .subscribe(() => this._update());
    this._update();
  }

  private _update(): void {
    if (!this.links || !this.linksWithHrefs || !this.router.navigated) {
      return;
    }

    /**
     * This a way of causing something to happen in the next micro-task / during a new round
     * of change detection.
     */
    Promise.resolve().then(() => {
      const matchExp = this._matchExp;

      for (const classes of Object.keys(matchExp)) {
        if (matchExp[classes] && typeof matchExp[classes] === 'string') {
          const regexp = new RegExp(matchExp[classes]);
          if (this._curRoute.match(regexp)) {
            this._toggleClass(classes, true);
          } else {
            this._toggleClass(classes, false);
          }
        }
      }
    });
  }

  private _toggleClass(classes: string, enabled: boolean): void {
    classes
      .split(/\s+/g)
      .filter((cls) => !!cls)
      .forEach((cls) => {
        if (enabled) {
          this._renderer.addClass(this._ngEl.nativeElement, cls);
        } else {
          this._renderer.removeClass(this._ngEl.nativeElement, cls);
        }
      });
  }

  ngOnDestroy() {}
}

@NgModule({
  declarations: [RouterLinkMatch],
  exports: [RouterLinkMatch],
})
export class RouterLinkMatchModule {}
