const { join } = require('path');

require('ts-node').register({ project: join(__dirname, '../tsconfig.json') });
const { build } = require('./builder');
const { packages } = require('./config');

build({
  scope: '@ngrx-utils',
  packages
}).catch(err => {
  console.error(err);
  process.exit(1);
});
