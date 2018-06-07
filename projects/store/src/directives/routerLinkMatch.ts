import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  QueryList,
  Renderer2
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { untilDestroy } from '../operators';

export interface MatchExp {
  [classes: string]: string;
}

/**
 * TODO: Add docs
 */
@Directive({
  selector: '[routerLinkMatch]'
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

  constructor(private router: Router, private _renderer: Renderer2, private _ngEl: ElementRef) {
    router.events.pipe(untilDestroy(this)).subscribe(e => {
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
    this.linksWithHrefs.changes.pipe(untilDestroy(this)).subscribe(() => this._update());
    this._update();
  }

  private _update(): void {
    if (!this.links || !this.linksWithHrefs || !this.router.navigated) {
      return;
    }

    /**
     * This will push update to the last of event queue to avoid
     * active class won't apply when list of link has changed.
     */
    Promise.resolve().then(() => {
      const matchExp = this._matchExp;

      Object.keys(matchExp).forEach(cls => {
        if (matchExp[cls] && typeof matchExp[cls] === 'string') {
          const regexp = new RegExp(matchExp[cls]);
          if (this._curRoute.match(regexp)) {
            this._toggleClass(cls, true);
          } else {
            this._toggleClass(cls, false);
          }
        } else {
          throw new TypeError(
            `Could not convert match value to Regular Expression. ` +
              `Unexpected type '${typeof matchExp[cls]}' for value of key '${cls}' ` +
              `in routerLinkMatch directive match expression, expected 'non-empty string'`
          );
        }
      });
    });
  }

  private _toggleClass(classes: string, enabled: boolean): void {
    /**
     * FIXME: Refine active class to apply (store in private variable).
     */
    classes
      .trim()
      .split(/\s+/g)
      .forEach(cls => {
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
  exports: [RouterLinkMatch]
})
export class RouterLinkMatchModule {}
