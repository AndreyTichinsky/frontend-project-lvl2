export const correctDiff1to2 = `{
 - follow: false
   host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
 + timeout: 20
 + verbose: true
}`;
export const correctDiff2to1 = `{
 + follow: false
   host: hexlet.io
 + proxy: 123.234.53.22
 - timeout: 20
 + timeout: 50
 - verbose: true
}`;
export const f1Diff = `{
   follow: false
   host: hexlet.io
   proxy: 123.234.53.22
   timeout: 50
}`;
