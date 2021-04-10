import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const getFormatter = (formatterName) => {
  switch (formatterName) {
    case 'plain':
      return plain;
    case 'json':
      return json;
    default:
      return stylish;
  }
};

export default getFormatter;
