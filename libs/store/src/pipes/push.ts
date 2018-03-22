import { ChangeDetectorRef, NgModule, OnDestroy, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Pipe({ name: 'push', pure: false })
export class PushPipe implements OnDestroy {
  private sub: Subscription | null = null;
  private value: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  transform<T>(obs: Observable<T>): T {
    if (this.sub === null) {
      this.sub = obs.subscribe(value => {
        this.value = value;
        this.cdr.detectChanges();
      });
      return this.value;
    }
    return this.value;
  }

  ngOnDestroy() {
    if (this.sub !== null) {
      this.sub.unsubscribe();
      this.value = null;
    }
  }
}

@NgModule({
  exports: [PushPipe],
  declarations: [PushPipe]
})
export class PushPipeModule {}
