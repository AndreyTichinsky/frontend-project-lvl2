const plain = (ast) => {
  const basePath = '';
  const checkString = (value) => (typeof value === 'string' ? `'${value}'` : value);
  const checkComplex = (value) => (Array.isArray(value) ? '[complex value]' : checkString(value));
  const traverse = (tree, path) => tree.reduce((acc, {
    key, value, type, valueBefore, valueAfter,
  }) => {
    const updPath = `${path}${path ? '.' : ''}${key}`;
    switch (type) {
      case 'removed':
        acc.push(`Property '${updPath}' was removed`);
        break;
      case 'added':
        acc.push(`Property '${updPath}' was added with value: ${checkComplex(value)}`);
        break;
      case 'updated':
        acc.push(`Property '${updPath}' was updated. From ${checkComplex(
          valueBefore,
        )} to ${checkComplex(valueAfter)}`);
        break;
      default:
    }
    if (Array.isArray(value)) {
      acc.push(traverse(value, updPath));
    }
    return acc;
  }, []);
  const result = traverse(ast, basePath);
  return result.flat(Infinity).join('\n');
};
export default plain;
