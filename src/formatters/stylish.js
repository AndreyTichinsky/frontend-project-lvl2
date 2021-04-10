const strWithIndent = (prop, value, sym, ind) => `\n${' '.repeat(ind - 2)}${sym} ${prop}: ${value}`;
const wrap = (str, ind) => `{${str}\n${' '.repeat(ind)}}`;
const concatStr = ({
  key, ifArr, value, ind, sym, traverse,
}) => strWithIndent(
  key,
  ifArr ? wrap(traverse(value, ind), ind) : value,
  sym,
  ind,
);
const stylish = (ast) => {
  const indent = 0;
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
          temp += concatStr({
            key,
            ifArr: ifValueArr,
            value,
            ind: updInd,
            sym: ' ',
            traverse,
          });
          break;
        case 'removed':
          temp += concatStr({
            key,
            ifArr: ifValueArr,
            value,
            ind: updInd,
            sym: '-',
            traverse,
          });
          break;
        case 'added':
          temp += concatStr({
            key,
            ifArr: ifValueArr,
            value,
            ind: updInd,
            sym: '+',
            traverse,
          });
          break;
        case 'updated':
          temp += concatStr({
            key,
            ifArr: ifValueBeforeArr,
            value: valueBefore,
            ind: updInd,
            sym: '-',
            traverse,
          });
          temp += concatStr({
            key,
            ifArr: ifValueAfterArr,
            value: valueAfter,
            ind: updInd,
            sym: '+',
            traverse,
          });
          break;
        default:
      }
      return temp;
    }, '');
  };
  return wrap(traverse(ast, indent), indent);
};
export default stylish;
