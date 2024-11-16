// .mocharc.cjs
module.exports = {
  extension: ['mjs', 'cjs'],
  spec: 'backend/tests/**/*.test.{mjs,cjs}',
  require: ['@babel/register'], // If using Babel
};