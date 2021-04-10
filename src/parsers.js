import yaml from 'js-yaml';

export const jsonParse = (content) => JSON.parse(content);

export const yamlParse = (content) => yaml.load(content);
