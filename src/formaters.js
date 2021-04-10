const stylish = (ast) => {
  const indent = 0;
  const strWithIndent = (prop, value, sym, ind) => `\n${' '.repeat(ind - 2)}${sym} ${prop}: ${value}`;
  const wrap = (str, ind) => `{${str}\n${' '.repeat(ind)}}`;
  const traverse = (tree, ind) => {
    const updInd = ind + 4;
    return tree.reduce((acc, {
      key, value, type, valueBefore, valueAfter,
    }) => {
      let temp = acc;
      const ifValueArr = Array.isArray(value);
      const ifValueBeforeArr = Array.isArray(valueBefore);
      const ifValueAfterArr = Array.isArray(valueAfter);

      switch (type) {
        case 'unchanged':
          temp += strWithIndent(
            key,
            ifValueArr ? wrap(traverse(value, updInd), updInd) : value,
            ' ',
            updInd,
          );
          break;
        case 'deleted':
          temp += strWithIndent(
            key,
            ifValueArr ? wrap(traverse(value, updInd), updInd) : value,
            '-',
            updInd,
          );
          break;
        case 'added':
          temp += strWithIndent(
            key,
            ifValueArr ? wrap(traverse(value, updInd), updInd) : value,
            '+',
            updInd,
          );
          break;
        case 'changed':
          temp += strWithIndent(
            key,
            ifValueBeforeArr
              ? wrap(traverse(valueBefore, updInd), updInd)
              : valueBefore,
            '-',
            updInd,
          );
          temp += strWithIndent(
            key,
            ifValueAfterArr
              ? wrap(traverse(valueAfter, updInd), updInd)
              : valueAfter,
            '+',
            updInd,
          );
          break;
        default:
      }
      return temp;
    }, '');
  };
  return wrap(traverse(ast, indent), indent);
};
export default stylish;
