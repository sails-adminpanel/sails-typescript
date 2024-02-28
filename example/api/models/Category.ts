import { Attributes, ModelTypeDetection, Model } from "sails-typescript";
import { v4 as uuid } from "uuid";
import slugify from "slugify"
/**
 * Define sails prject model 
 * 
 * When you define model by this template, you should also add 
 * this model in `ProjectModel` type `types/projectModels.d.ts`
 *  */ 

// Define Attributes
export type CategoryInstance = Category;
interface Category extends Partial<ModelOptions> {}
type ModelOptions = ModelTypeDetection<typeof attributes>
let a: Attributes;
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
} as const;


// Category model
const methods = {
  beforeCreate(record: Category, cb: (err?: Error | string) => void) {
    if (!record.id) {
      record.id = uuid();
    }
    if(!record.slug) {
      record.slug = slugify(`${record.name}`, { remove: /[*+~.()'"!:@\\\/]/g, lower: true, strict: true, locale: 'en'})
    }
    cb();
  },
};


const model = {
  primaryKey: "id" as const,
  attributes: attributes,
  ...methods,
};

module.exports = model;

declare global {
  const Category: Model<typeof model>;
  interface Models {
    Category: Category;
  }
}