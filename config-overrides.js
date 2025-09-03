const { override, addPostcssPlugins, addBabelPlugin } = require('customize-cra');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');
const tailwindConfig = require('./tailwind.config.js');

module.exports = override(
  addPostcssPlugins([
    tailwindcss(tailwindConfig),
    autoprefixer,
  ]),
  addBabelPlugin('relay')
);
