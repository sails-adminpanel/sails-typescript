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
    /**
     * For add custom type (ex: OptionsArticleModel) for json type Field you should import
     * you type in `types/customTypes.d.ts` file, and assign your type
     * for key with same name as your json type field
     *
     * ⚠️ For different models with the same `'json'` property, there must be one type.
     * In the current version, I haven't found a more elegant way to solve this.
     *
     * If you have an idea please contact us, or make a github issue / PR in this repo
     */
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
