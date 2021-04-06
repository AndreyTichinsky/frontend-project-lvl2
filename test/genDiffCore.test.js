import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { correctDiff1to2, correctDiff2to1, json1Diff } from '../__fixtures__/data.js';

import genDiff from '../src/genDiffCore.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const jsonPath1 = getFixturePath('f1.json');
const jsonPath2 = getFixturePath('f2.json');

describe('genDiffCore testing', () => {
  test('compare first json to second', () => {
    expect(genDiff(jsonPath1, jsonPath2)).toEqual(correctDiff1to2);
  });
  test('compare second json to first', () => {
    expect(genDiff(jsonPath2, jsonPath1)).toEqual(correctDiff2to1);
  });
  test('compare same json', () => {
    expect(genDiff(jsonPath1, jsonPath1)).toEqual(json1Diff);
  });
});
