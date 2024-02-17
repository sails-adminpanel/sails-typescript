const nodePath = require('path');
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./.tmp/public/assets`;
const srcFolder = `./assets`;

module.exports.path = {
  build: {
    js: `${buildFolder}/js/`,
    dependencies: `${buildFolder}/dependencies/`,
    img: `${buildFolder}/images/`,
    css: `${buildFolder}/styles/`,
    fonts: `${buildFolder}/fonts/`,
    files: `${buildFolder}/files/`
  },
  src: {
    js: `${srcFolder}/js/script.js`,
    dependencies: `${srcFolder}/dependencies/*.js`,
    img: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
    svgicons: `${srcFolder}/svgicons/*.svg`,
    scss: `${srcFolder}/styles/style.scss`,
    fonts: `${srcFolder}/fonts/ready/*.{woff,woff2}`,
    files: `${srcFolder}/files/*.*`
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    scss: `${srcFolder}/styles/**/*.scss`,
    ejs: `${srcFolder}/views/**/*.ejs`,
    img: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`
  },
  clean: buildFolder,
  srcfolder: srcFolder,
  rootfolder: rootFolder
}