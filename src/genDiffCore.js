import { Command } from 'commander/esm.mjs';
import * as fs from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = () => {
  const program = new Command();

  const resolveFile = (rawPath, curDir) => {
    const filepath = path.resolve(curDir, rawPath);
    const json = fs.readFileSync(filepath, 'utf8');
    const parsedJson = JSON.parse(json);
    return parsedJson;
  };

  const genDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const union = _.union(keys1, keys2).sort();
    const intersection = _.intersection(keys1, keys2);
    const diff1 = _.difference(keys1, intersection);
    const diff2 = _.difference(keys2, intersection);
    const helper = (prop, value, sym) => {
      return `\n ${sym} ${prop}: ${value}`;
    };
    const wrap = (str) => {
      return `{${str}\n}`;
    };
    const result = union.reduce((acc, cur, idx) => {
      if (intersection.includes(cur)) {
        if (obj1[cur] === obj2[cur]) {
          acc += helper(cur, obj1[cur], ' ');
        } else {
          acc += helper(cur, obj1[cur], '-');
          acc += helper(cur, obj2[cur], '+');
        }
      } else if (diff1.includes(cur)) {
        acc += helper(cur, obj1[cur], '-');
      } else if (diff2.includes(cur)) {
        acc += helper(cur, obj2[cur], '+');
      }
      return acc;
    }, '');
    return wrap(result);
  };

  program
    .arguments('<filepath1> <filepath2>')
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1', '-V, --version', 'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2, type) => {
      const curDir = process.cwd();
      const obj1 = resolveFile(filepath1, curDir);
      const obj2 = resolveFile(filepath2, curDir);
      const diff = genDiff(obj1, obj2);
      console.log(diff);
    });

  program.parse(process.argv);
};
export default genDiff;


