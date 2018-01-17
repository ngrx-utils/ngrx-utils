#!/usr/bin/env node

import { generateFileOutput } from '../src/printer';

import chalk from 'chalk';

import * as caporal from 'caporal';

// Work arround for typings issue in caporal
const program: Caporal = caporal as any;

program
  .version('0.1.0')
  .command('generate', 'Generate boilerplate')
  .alias('g')
  .argument('<type>', 'Type of boilerplate. At this time only action (a) is available', ['a', 'action'])
  .option('-r, --reducer <true>', 'optionally generate a reducer function', program.BOOL)
  .argument('<path>', 'Path to action declaration file')
  .action((args, options) => {
    switch (args.type) {
      case 'a':
      case 'action':
        if (options.reducer) console.log(chalk.green('Will generate reducer too'));
        generateFileOutput(args.path, options.reducer);
        break;
      default:
        console.log(chalk.blue('See --help for usage'));
    }
  });

program.parse(process.argv);
