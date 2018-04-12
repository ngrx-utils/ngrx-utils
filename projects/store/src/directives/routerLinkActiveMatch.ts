import {
  Directive,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { untilDestroy } from '../operators';

export interface MatchExp {
  [classes: string]: string;
}

@Directive({
  selector: '[routerLinkActiveMatch]'
})
export class RouterLinkActiveMatch implements OnDestroy, OnChanges {
  private _curRoute: string;
  private _matchExp: MatchExp;
  private _onChangesHook = new Subject<MatchExp>();

  @Input('routerLinkActiveMatch')
  set routerLinkActiveMatch(v: MatchExp) {
    if (v && typeof v === 'object') {
      this._matchExp = v;
    } else {
      throw new TypeError(
        `Unexpected type '${typeof v}' of value for ` +
          `input of routerLinkActiveMatch directive, expected 'object'`
      );
    }
  }

  constructor(router: Router, private _renderer: Renderer2, private _ngEl: ElementRef) {
    combineLatest(router.events, this._onChangesHook)
      .pipe(map(([e]) => e), filter(e => e instanceof NavigationEnd), untilDestroy(this))
      .subscribe(e => {
        this._curRoute = (e as NavigationEnd).urlAfterRedirects;

        this._updateClass(this._matchExp);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['routerLinkActiveMatch']) {
      this._onChangesHook.next(changes['routerLinkActiveMatch'].currentValue);
    }
  }

  private _updateClass(v: MatchExp): void {
    Object.keys(v).forEach(cls => {
      if (v[cls] && typeof v[cls] === 'string') {
        const regexp = new RegExp(v[cls]);
        if (this._curRoute.match(regexp)) {
          this._toggleClass(cls, true);
        } else {
          this._toggleClass(cls, false);
        }
      } else {
        throw new TypeError(
          `Could not convert match value to Regular Expression. ` +
            `Unexpected type '${typeof v[cls]}' for value of key '${cls}' ` +
            `in routerLinkActiveMatch directive match expression, expected 'non-empty string'`
        );
      }
    });
  }

  private _toggleClass(classes: string, enabled: boolean): void {
    classes = classes.trim();

    classes.split(/\s+/g).forEach(cls => {
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
  declarations: [RouterLinkActiveMatch],
  exports: [RouterLinkActiveMatch]
})
export class RouterLinkActiveMatchModule {}
