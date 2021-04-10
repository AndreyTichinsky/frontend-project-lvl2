import * as fs from 'fs';

const readFile = (absolutePath) => fs.readFileSync(absolutePath, 'utf8');
export default readFile;
