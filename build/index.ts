import build from './builder';
import { packages } from './config';

build({
  scope: '@ngrx-utils',
  packages
}).catch(err => {
  console.error(err);
  process.exit(1);
});
