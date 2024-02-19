"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
let service = {
    async exec(domain, name) {
        let example;
        let a = await Category.create({ "id": "test" }).fetch();
        let b = await Category.find({ "where": { id: "123" } });
        let b0 = await Category.find({ id: "123" });
        let b1 = await Category.find("test");
        let c = await Category.findOne({ "id": "test" }).populate("articles");
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
