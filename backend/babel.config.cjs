// babel.config.cjs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // Specifies the Node.js version to target
      },
    ],
  ],
};