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

const buildString = ({
  type,
  valueBefore,
  valueAfter,
  baseStr,
  ...defaultConfig
}) => {
  switch (type) {
    case 'unchanged':
      return baseStr + concatStr({ ...defaultConfig, sym: ' ' });
    case 'removed':
      return baseStr + concatStr({ ...defaultConfig, sym: '-' });
    case 'added':
      return baseStr + concatStr({ ...defaultConfig, sym: '+' });
    case 'updated':
      return (
        baseStr
        + concatStr({
          ...defaultConfig,
          ifArr: Array.isArray(valueBefore),
          value: valueBefore,
          sym: '-',
        })
        + concatStr({
          ...defaultConfig,
          ifArr: Array.isArray(valueAfter),
          value: valueAfter,
          sym: '+',
        })
      );
    default:
      throw new Error(`Unexpected type: ${type}`);
  }
};

const stylish = (ast) => {
  const indent = 0;
  const traverse = (tree, oldInd) => tree.reduce((acc, {
    key, value, type, valueBefore, valueAfter,
  }) => {
    const newInd = oldInd + 4;
    const defaultConfig = {
      key,
      ifArr: Array.isArray(value),
      value,
      ind: newInd,
      traverse,
    };
    const accStr = buildString({
      ...defaultConfig, type, valueBefore, valueAfter, baseStr: acc,
    });

    return accStr;
  }, '');
  return wrap(traverse(ast, indent), indent);
};
export default stylish;
