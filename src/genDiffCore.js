import _ from 'lodash';
import path from 'path';
import { yamlParse, jsonParse } from './parsers.js';
import getFormatter from './formatters/index.js';
import readFile from './readFile.js';

const stringify = (object) => {
  const traverse = (obj) => {
    const keys = Object.keys(obj).sort();
    return keys.reduce((acc, cur) => {
      acc.push({
        key: cur,
        value: typeof obj[cur] === 'object' ? traverse(obj[cur]) : obj[cur],
        type: 'unchanged',
      });
      return acc;
    }, []);
  };
  return traverse(object);
};

const buildDiff = (obj1, obj2, formatter) => {
  const traverse = (objA, objB) => {
    const keys1 = Object.keys(objA);
    const keys2 = Object.keys(objB);
    const union = _.union(keys1, keys2).sort();
    const intersection = _.intersection(keys1, keys2);
    const result = union.reduce((acc, cur) => {
      const isObj1 = typeof objA[cur] === 'object' && objA[cur] != null;
      const isObj2 = typeof objB[cur] === 'object' && objB[cur] != null;
      if (intersection.includes(cur)) {
        if (isObj1 && isObj2) {
          acc.push({
            key: cur,
            value: traverse(objA[cur], objB[cur]),
            type: 'unchanged',
          });
        } else if (isObj1 || isObj2) {
          acc.push({
            key: cur,
            valueBefore: isObj1 ? stringify(objA[cur]) : objA[cur],
            valueAfter: isObj2 ? stringify(objB[cur]) : objB[cur],
            type: 'updated',
          });
        } else if (objA[cur] === objB[cur]) {
          acc.push({
            key: cur,
            value: objA[cur],
            type: 'unchanged',
          });
        } else {
          acc.push({
            key: cur,
            valueBefore: objA[cur],
            valueAfter: objB[cur],
            type: 'updated',
          });
        }
      } else if (_.difference(keys1, intersection).includes(cur)) {
        acc.push({
          key: cur,
          value: isObj1 ? stringify(objA[cur]) : objA[cur],
          type: 'removed',
        });
      } else if (_.difference(keys2, intersection).includes(cur)) {
        acc.push({
          key: cur,
          value: isObj2 ? stringify(objB[cur]) : objB[cur],
          type: 'added',
        });
      }
      return acc;
    }, []);
    return result;
  };
  const finalAST = traverse(obj1, obj2);
  const formatterFunc = getFormatter(formatter);

  return formatterFunc(finalAST);
};

const makeObject = (filepath, curDir) => {
  const ext = path.extname(filepath);
  const absolutePath = path.resolve(curDir, filepath);
  const content = readFile(absolutePath);
  switch (ext) {
    case '.yaml':
    case '.yml':
      return yamlParse(content);
    case '.json':
      return jsonParse(content);
    default:
      throw new Error(`Unexpected file extension: ${ext}`);
  }
};

const genDiff = (filepath1, filepath2, formatter = 'stylish') => {
  const curDir = process.cwd();
  const obj1 = makeObject(filepath1, curDir);
  const obj2 = makeObject(filepath2, curDir);
  return buildDiff(obj1, obj2, formatter);
};

export default genDiff;
