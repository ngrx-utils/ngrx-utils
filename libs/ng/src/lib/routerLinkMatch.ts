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
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkWithHref
} from '@angular/router';
import { Subscription } from 'rxjs';

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
  private _watch: Subscription;

  @ContentChildren(RouterLink, { descendants: true })
  links: QueryList<RouterLink>;

  @ContentChildren(RouterLinkWithHref, { descendants: true })
  linksWithHrefs: QueryList<RouterLinkWithHref>;

  @Input('routerLinkMatch')
  set routerLinkMatch(matchExp: MatchExp) {
    if (matchExp != null && typeof matchExp === 'object') {
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
    this._watch = router.events.subscribe(e => {
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
    this._watch.add(this.links.changes.subscribe(() => this._update()));
    this._watch.add(
      this.linksWithHrefs.changes.subscribe(() => this._update())
    );
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

      Object.keys(matchExp).forEach(classes => {
        if (matchExp[classes] && typeof matchExp[classes] === 'string') {
          const regexp = new RegExp(matchExp[classes]);
          if (this._curRoute.match(regexp)) {
            this._toggleClass(classes, true);
          } else {
            this._toggleClass(classes, false);
          }
        }
      });
    });
  }

  private _toggleClass(classes: string, enabled: boolean): void {
    classes
      .split(/\s+/g)
      .filter(cls => !!cls)
      .forEach(cls => {
        if (enabled) {
          this._renderer.addClass(this._ngEl.nativeElement, cls);
        } else {
          this._renderer.removeClass(this._ngEl.nativeElement, cls);
        }
      });
  }

  ngOnDestroy() {
    this._watch.unsubscribe();
  }
}

@NgModule({
  declarations: [RouterLinkMatch],
  exports: [RouterLinkMatch]
})
export class RouterLinkMatchModule {}
