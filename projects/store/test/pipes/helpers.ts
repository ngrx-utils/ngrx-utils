/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ChangeDetectorRef } from '@angular/core';

export class SpyObject {
  static stub(object: any = null, config: any = null, overrides: any = null) {
    if (!(object instanceof SpyObject)) {
      overrides = config;
      config = object;
      object = new SpyObject();
    }

    const m = { ...config, ...overrides };
    Object.keys(m).forEach(key => {
      object.spy(key).and.returnValue(m[key]);
    });
    return object;
  }

  constructor(type?: any) {
    if (type) {
      for (const prop in type.prototype) {
        let m: any = null;
        try {
          m = type.prototype[prop];
        } catch (e) {
          // As we are creating spys for abstract classes,
          // these classes might have getters that throw when they are accessed.
          // As we are only auto creating spys for methods, this
          // should not matter.
        }
        if (typeof m === 'function') {
          this.spy(prop);
        }
      }
    }
  }

  spy(name: string) {
    if (!(this as any)[name]) {
      (this as any)[name] = jasmine.createSpy(name);
    }
    return (this as any)[name];
  }

  prop(name: string, value: any) {
    (this as any)[name] = value;
  }
}

export class SpyChangeDetectorRef extends SpyObject {
  constructor() {
    super(ChangeDetectorRef);
    this.spy('detectChanges');
  }
}

export class SpyNgControl extends SpyObject {}

export class SpyValueAccessor extends SpyObject {
  writeValue: any;
}

export class AsyncTestCompleter {
  private _resolve: (result: any) => void;
  private _reject: (err: any) => void;
  private _promise: Promise<any> = new Promise((res, rej) => {
    this._resolve = res;
    this._reject = rej;
  });
  done(value?: any) {
    this._resolve(value);
  }

  fail(error?: any, stackTrace?: string) {
    this._reject(error);
  }

  get promise(): Promise<any> {
    return this._promise;
  }
}
