import plain from './plain.js';
import stylish from './stylish.js';

const getFormatter = (formatterName) => {
  switch (formatterName) {
    case 'plain':
      return plain;
    default:
      return stylish;
  }
};

export default getFormatter;
