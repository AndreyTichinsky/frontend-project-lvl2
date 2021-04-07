import yaml from 'js-yaml';
import * as fs from 'fs';

export const jsonParser = (filepath) => {
  const json = fs.readFileSync(filepath, 'utf8');
  const parsedJson = JSON.parse(json);
  return parsedJson;
};

export const yamlParser = (filepath) => yaml.load(fs.readFileSync(filepath, 'utf8'));
