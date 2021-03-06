import fp from 'lodash/fp.js';
import _ from 'lodash';
import path from 'path';
import { yamlParse, jsonParse } from './parsers.js';
import getFormatter from './formatters/index.js';
import readFile from './readFile.js';

const stringify = (object) => {
  const traverse = (obj) => {
    const keys = fp.sortBy(_.identity)(Object.keys(obj));
    return keys.reduce(
      (acc, cur) => _.concat(acc, [
        {
          key: cur,
          value: typeof obj[cur] === 'object' ? traverse(obj[cur]) : obj[cur],
          type: 'unchanged',
        },
      ]).flat(Infinity),
      [],
    );
  };
  return traverse(object);
};

const isObj = (obj) => typeof obj === 'object' && obj != null;

const buildDiff = (obj1, obj2, formatter) => {
  const traverse = (objA, objB) => {
    const keys1 = Object.keys(objA);
    const keys2 = Object.keys(objB);
    const union = fp.sortBy(_.identity)(_.union(keys1, keys2));
    const intersection = _.intersection(keys1, keys2);
    const diff1 = _.difference(keys1, intersection);
    const diff2 = _.difference(keys2, intersection);
    const result = union.reduce((acc, cur) => {
      const isObj1 = isObj(objA[cur]);
      const isObj2 = isObj(objB[cur]);
      if (intersection.includes(cur)) {
        if (isObj1 && isObj2) {
          return _.concat(acc, {
            key: cur,
            value: traverse(objA[cur], objB[cur]),
            type: 'unchanged',
          });
        } if (isObj1 || isObj2) {
          return _.concat(acc, {
            key: cur,
            valueBefore: isObj1 ? stringify(objA[cur]) : objA[cur],
            valueAfter: isObj2 ? stringify(objB[cur]) : objB[cur],
            type: 'updated',
          });
        } if (objA[cur] === objB[cur]) {
          return _.concat(acc, {
            key: cur,
            value: objA[cur],
            type: 'unchanged',
          });
        }
        return _.concat(acc, {
          key: cur,
          valueBefore: objA[cur],
          valueAfter: objB[cur],
          type: 'updated',
        });
      } if (diff1.includes(cur)) {
        return _.concat(acc, {
          key: cur,
          value: isObj1 ? stringify(objA[cur]) : objA[cur],
          type: 'removed',
        });
      } if (diff2.includes(cur)) {
        return _.concat(acc, {
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
