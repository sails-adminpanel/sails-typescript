/**
 * WRONG SAILS HACK
 */

const replace = require("replace-in-file");

/**
 * 1. Patch for ignore typescript files when sails load services and modeles
 */
console.warn("TypeScript ignore sails hack v0.1");
const results = replace.sync({
  files: [
    __dirname + "/../node_modules/sails/lib/hooks/moduleloader/index.js",
    __dirname + "/../node_modules/sails/lib/app/private/controller/load-action-modules.js",
    __dirname + "/../node_modules/sails/lib/hooks/helpers/private/load-helpers.js"
  ], 
  from: [
    /md|txt/g,
  ],
  to: "md|ts|txt",
});

console.log(results);
