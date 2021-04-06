import _ from 'lodash';
import resolveFile from './resolveFile.js';

const buildDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const union = _.union(keys1, keys2).sort();
  const intersection = _.intersection(keys1, keys2);
  const diff1 = _.difference(keys1, intersection);
  const diff2 = _.difference(keys2, intersection);
  const helper = (prop, value, sym) => `\n ${sym} ${prop}: ${value}`;
  const wrap = (str) => `{${str}\n}`;
  const result = union.reduce((acc, cur) => {
    let temp = acc;
    if (intersection.includes(cur)) {
      if (obj1[cur] === obj2[cur]) {
        temp += helper(cur, obj1[cur], ' ');
      } else {
        temp += helper(cur, obj1[cur], '-');
        temp += helper(cur, obj2[cur], '+');
      }
    } else if (diff1.includes(cur)) {
      temp += helper(cur, obj1[cur], '-');
    } else if (diff2.includes(cur)) {
      temp += helper(cur, obj2[cur], '+');
    }
    return temp;
  }, '');
  return wrap(result);
};

const genDiff = (filepath1, filepath2) => {
  const curDir = process.cwd();
  const obj1 = resolveFile(filepath1, curDir);
  const obj2 = resolveFile(filepath2, curDir);
  return buildDiff(obj1, obj2);
};

export default genDiff;
