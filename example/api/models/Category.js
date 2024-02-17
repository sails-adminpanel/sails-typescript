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
    slug: {
        type: "string",
        unique: true
    },
    section: {
        type: "string",
        isIn: ['news', 'blog']
    },
    articles: {
        collection: "Article",
        via: "links"
    }
};
// Category model
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
