const plain = (ast) => {
  const basePath = '';
  const checkString = (value) => (typeof value === 'string' ? `'${value}'` : value);
  const checkComplex = (value) => (Array.isArray(value) ? '[complex value]' : checkString(value));
  const traverse = (tree, path) => tree.reduce((acc, {
    key, value, type, valueBefore, valueAfter,
  }) => {
    let temp = acc;
    const updPath = `${path}${path ? '.' : ''}${key}`;
    switch (type) {
      case 'removed':
        temp += `\nProperty '${updPath}' was removed`;
        break;
      case 'added':
        temp += `\nProperty '${updPath}' was added with value: ${checkComplex(value)}`;
        break;
      case 'updated':
        temp += `\nProperty '${updPath}' was updated. From ${checkComplex(
          valueBefore,
        )} to ${checkComplex(valueAfter)}`;
        break;
      default:
    }
    if (Array.isArray(value)) {
      temp += traverse(value, updPath);
    }
    return temp;
  }, '');
  return traverse(ast, basePath);
};
export default plain;
