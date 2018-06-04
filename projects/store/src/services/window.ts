import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const WINDOW = new InjectionToken('WINDOW_TOKEN', {
  factory: () => {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      return window;
    }

    return new Object();
  }
});
