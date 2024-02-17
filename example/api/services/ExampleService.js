"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
let service = {
    async exec(domain, name) {
        let example;
        try {
            example = await axios_1.default.post(domain, {
                name: name
            });
            return example.data;
        }
        catch (err) {
            return err;
        }
    }
};
module.exports = {
    ...service
};
