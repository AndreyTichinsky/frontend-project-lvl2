#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import genDiff from '../src/genDiffCore.js';

const program = new Command();

program
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const result = genDiff(filepath1, filepath2, options.format);
    console.log(result);
    return result;
  });

program.parse(process.argv);
