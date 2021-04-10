import _ from 'lodash';
import path from 'path';
import { yamlParser, jsonParser } from './parsers.js';
import stylish from './formaters.js';

const stringify = (object) => {
  const traverse = (obj) => {
    const keys = Object.keys(obj).sort();
    return keys.reduce((acc, cur) => {
      if (typeof obj[cur] === 'object') {
        acc.push({
          key: cur,
          value: traverse(obj[cur]),
          type: 'unchanged',
        });
      } else {
        acc.push({
          key: cur,
          value: obj[cur],
          type: 'unchanged',
        });
      }
      return acc;
    }, []);
  };
  return traverse(object);
};

const buildDiff = (obj1, obj2, formater) => {
  const traverse = (objA, objB) => {
    const keys1 = Object.keys(objA);
    const keys2 = Object.keys(objB);
    const union = _.union(keys1, keys2).sort();
    const intersection = _.intersection(keys1, keys2);
    const diff1 = _.difference(keys1, intersection);
    const diff2 = _.difference(keys2, intersection);
    const result = union.reduce((acc, cur) => {
      const temp = acc;
      const isObj1 = typeof objA[cur] === 'object' && objA[cur] != null;
      const isObj2 = typeof objB[cur] === 'object' && objB[cur] != null;
      if (intersection.includes(cur)) {
        if (isObj1 && isObj2) {
          temp.push({
            key: cur,
            value: traverse(objA[cur], objB[cur]),
            type: 'unchanged',
          });
        } else if (isObj1 || isObj2) {
          temp.push({
            key: cur,
            valueBefore: isObj1 ? stringify(objA[cur]) : objA[cur],
            valueAfter: isObj2 ? stringify(objB[cur]) : objB[cur],
            type: 'changed',
          });
        } else if (objA[cur] === objB[cur]) {
          temp.push({
            key: cur,
            value: objA[cur],
            type: 'unchanged',
          });
        } else {
          temp.push({
            key: cur,
            valueBefore: objA[cur],
            valueAfter: objB[cur],
            type: 'changed',
          });
        }
      } else if (diff1.includes(cur)) {
        temp.push({
          key: cur,
          value: isObj1 ? stringify(objA[cur]) : objA[cur],
          type: 'deleted',
        });
      } else if (diff2.includes(cur)) {
        temp.push({
          key: cur,
          value: isObj2 ? stringify(objB[cur]) : objB[cur],
          type: 'added',
        });
      }
      return temp;
    }, []);
    return result;
  };
  const finalAST = traverse(obj1, obj2);

  return formater(finalAST);
};

const allocator = (filepath, curDir) => {
  const ext = path.extname(filepath);
  const absolutePath = path.resolve(curDir, filepath);
  switch (ext) {
    case '.yaml':
    case '.yml':
      return yamlParser(absolutePath);
    case '.json':
      return jsonParser(absolutePath);
    default:
      throw new Error('Unexpected file extension');
  }
};

const genDiff = (filepath1, filepath2, formater = stylish) => {
  const curDir = process.cwd();
  const obj1 = allocator(filepath1, curDir);
  const obj2 = allocator(filepath2, curDir);
  return buildDiff(obj1, obj2, formater);
};

export default genDiff;
