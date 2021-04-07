import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { correctDiff1to2, correctDiff2to1, f1Diff } from '../__fixtures__/data.js';

import genDiff from '../src/genDiffCore.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const jsonPath1 = getFixturePath('f1.json');
const jsonPath2 = getFixturePath('f2.json');
const yamlPath1 = getFixturePath('f1.yaml');
const yamlPath2 = getFixturePath('f2.yaml');

describe('genDiffCore json testing', () => {
  test('compare first json to second', () => {
    expect(genDiff(jsonPath1, jsonPath2)).toEqual(correctDiff1to2);
  });
  test('compare second json to first', () => {
    expect(genDiff(jsonPath2, jsonPath1)).toEqual(correctDiff2to1);
  });
  test('compare same json', () => {
    expect(genDiff(jsonPath1, jsonPath1)).toEqual(f1Diff);
  });
});

describe('genDiffCore yaml testing', () => {
  test('compare first yaml to second', () => {
    expect(genDiff(yamlPath1, yamlPath2)).toEqual(correctDiff1to2);
  });
  test('compare second yaml to first', () => {
    expect(genDiff(yamlPath2, yamlPath1)).toEqual(correctDiff2to1);
  });
  test('compare same yaml', () => {
    expect(genDiff(yamlPath1, yamlPath1)).toEqual(f1Diff);
  });
});
