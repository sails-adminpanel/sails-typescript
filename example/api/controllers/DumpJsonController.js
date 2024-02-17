"use strict";
const child_process = require('child_process');
const folderpath = './.tmp';
const fs = require("fs");
module.exports = {
    index: async function (req, res) {
        if (process.env.NODE_ENV === "production") {
            return res.forbidden();
        }
        for (let model in sails.models) {
            let data = await sails.models[model].find().populateAll();
            fs.writeFileSync(`${folderpath}/${model}.json`, JSON.stringify(data, null, 2));
        }
        res.send("Done, look at the .tmp folder");
    }
};
