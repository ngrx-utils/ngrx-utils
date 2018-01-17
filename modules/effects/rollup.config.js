export default {
  input: './dist/effects/@ngrx-utils/effects.es5.js',
  output: {
    file: './dist/effects/bundles/effects.umd.js',
    name: 'ngrxUtils.effects',
    format: 'umd',
    globals: {
      '@angular/core': 'ng.core',
      '@ngrx/store': 'ngrx.store'
    },
    exports: 'named'
  }
};
