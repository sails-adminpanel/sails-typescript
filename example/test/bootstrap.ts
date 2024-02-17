import "mocha";
// import {run} from "data-mocks-server";
let fs = require('fs');
require("dotenv").config();
var Sails = require("sails").Sails;

let exampleScenario = JSON.parse(fs.readFileSync(__dirname + '/datamocks/exampleScenario.json', 'utf8'));

before(function (done) {

  // Example mocks test
  // run({
  //   default: [
  //     exampleScenario
  //   ]
  // });

  this.timeout(50000);
  Sails().lift(
    {
      hooks: { grunt: false },
      models: { migrate: "drop" },
      port: 1337,
      log: { level: "error" },
    },
    function (err: any, _sails: any) {
      if (err) return done(err);
      //@ts-ignore
      global.sails = _sails;
      return done();
    }
  );
});

after(function (done) {
  //@ts-ignore
  if (global.sails) {
    //@ts-ignore
    return global.sails.lower(function (err: Error) {
      if (err) {
        done();
      }
      done();
    });
  }
  done();
});
