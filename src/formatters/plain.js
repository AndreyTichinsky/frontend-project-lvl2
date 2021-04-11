import _ from 'lodash';

const checkString = (value) => (typeof value === 'string' ? `'${value}'` : value);

const checkComplex = (value) => (Array.isArray(value) ? '[complex value]' : checkString(value));

const buildString = ({
  type, path, value, valueBefore, valueAfter,
}) => {
  switch (type) {
    case 'removed':
      return `Property '${path}' was removed`;
    case 'added':
      return `Property '${path}' was added with value: ${checkComplex(value)}`;
    case 'updated':
      return `Property '${path}' was updated. From ${checkComplex(
        valueBefore,
      )} to ${checkComplex(valueAfter)}`;
    case 'unchanged':
      return '';
    default:
      throw new Error(`Unexpected type: ${type}`);
  }
};
const plain = (ast) => {
  const basePath = '';
  const traverse = (tree, path) => tree.reduce((acc, cur) => {
    const { key, value } = cur;
    const updPath = `${path}${path ? '.' : ''}${key}`;
    const curStr = buildString({ ...cur, path: updPath });
    const innerTree = Array.isArray(value) ? traverse(value, updPath) : [];
    return _.compact(_.concat(acc, curStr, ...innerTree));
  }, []);
  const result = traverse(ast, basePath);
  return result.flat(Infinity).join('\n');
};
export default plain;
