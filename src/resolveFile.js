import * as fs from 'fs';
import path from 'path';

const resolveFile = (rawPath, curDir) => {
  const filepath = path.resolve(curDir, rawPath);
  const json = fs.readFileSync(filepath, 'utf8');
  const parsedJson = JSON.parse(json);
  return parsedJson;
};
export default resolveFile;
