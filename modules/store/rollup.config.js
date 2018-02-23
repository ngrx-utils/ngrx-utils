export default {
  input: './dist/store/@ngrx-utils/store.es5.js',
  output: {
    file: './dist/store/bundles/store.umd.js',
    name: 'ngrxUtils.store',
    format: 'umd',
    globals: {
      '@angular/core': 'ng.core',
      '@ngrx/store': 'ngrx.store',
      'rxjs/Observable': 'Rx'
    },
    exports: 'named'
  }
};
