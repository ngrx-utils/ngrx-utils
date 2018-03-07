export default {
  input: './dist/store/@ngrx-utils/store.es5.js',
  output: {
    file: './dist/store/bundles/store.umd.js',
    name: 'ngrxUtils.store',
    format: 'umd',
    globals: {
      '@angular/core': 'ng.core',
      '@angular/router': 'ng.router',
      '@ngrx/store': 'ngrx.store',
      '@ngrx-utils/store': 'ngrxUtils.store',
      'rxjs/Observable': 'Rx',
      'rxjs/Subject': 'Rx'
    },
    exports: 'named'
  }
};
