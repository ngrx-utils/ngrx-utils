export default {
  input: './dist/cli/@ngrx-utils/cli.es5.js',
  output: {
    file: './dist/cli/bundles/cli.umd.js',
    name: 'ngrxUtils.cli',
    format: 'cjs',
    globals: {},
    exports: 'named'
  }
};
