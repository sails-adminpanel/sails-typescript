"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const slugify_1 = require("slugify");
let a;
const attributes = a = {
    id: {
        type: "string",
        unique: true
    },
    name: "string",
    requiredOption: {
        type: "boolean",
        required: true,
    },
    optionsArticleModel: {
        type: "json",
    },
    price: {
        type: "number",
        required: true
    },
    slug: {
        type: "string",
        unique: true
    },
    category: {
        model: "Category"
    },
    links: {
        collection: "Category",
        via: "articles"
    }
};
// Article model
const methods = {
    beforeCreate(record, cb) {
        if (!record.id) {
            record.id = (0, uuid_1.v4)();
        }
        if (!record.slug) {
            record.slug = (0, slugify_1.default)(`${record.name}`, { remove: /[*+~.()'"!:@\\\/]/g, lower: true, strict: true, locale: 'en' });
        }
        cb();
    },
};
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
