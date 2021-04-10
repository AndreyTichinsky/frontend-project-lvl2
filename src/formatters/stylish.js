const getStrWithIndent = ({
  key, value, sym, ind,
}) => `\n${' '.repeat(ind - 2)}${sym} ${key}: ${value}`;

const wrap = (str, ind) => `{${str}\n${' '.repeat(ind)}}`;

const concatStr = ({
  key, ifArr, value, ind, sym, traverse,
}) => getStrWithIndent({
  key,
  value: ifArr ? wrap(traverse(value, ind), ind) : value,
  sym,
  ind,
});

const stylish = (ast) => {
  const indent = 0;
  const traverse = (tree, oldInd) => tree.reduce((acc, {
    key, value, type, valueBefore, valueAfter,
  }) => {
    const newInd = oldInd + 4;
    let temp = acc;
    const defaultConfig = {
      key,
      ifArr: Array.isArray(value),
      value,
      ind: newInd,
      traverse,
    };
    switch (type) {
      case 'unchanged':
        temp += concatStr({ ...defaultConfig, sym: ' ' });
        break;
      case 'removed':
        temp += concatStr({ ...defaultConfig, sym: '-' });
        break;
      case 'added':
        temp += concatStr({ ...defaultConfig, sym: '+' });
        break;
      case 'updated':
        temp += concatStr({
          ...defaultConfig,
          ifArr: Array.isArray(valueBefore),
          value: valueBefore,
          sym: '-',
        });
        temp += concatStr({
          ...defaultConfig,
          ifArr: Array.isArray(valueAfter),
          value: valueAfter,
          sym: '+',
        });
        break;
      default:
    }
    return temp;
  }, '');
  return wrap(traverse(ast, indent), indent);
};
export default stylish;
