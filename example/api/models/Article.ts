import { Attributes, ModelTypeDetection, Model } from "sails-typescript";
import { v4 as uuid } from "uuid";
import slugify from "slugify"

export interface OptionsArticleModel {
  first: boolean
  second: string
}

//export type ArticleInstance = Article;
export interface IArticle extends Partial<ModelOptions> { }
type ModelOptions = ModelTypeDetection<typeof attributes>
let a: Attributes;
const attributes = a = {
  customId: {
    type: "number",
    autoIncrement:true
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
} as const;


// Article model
const methods = {
  beforeCreate(record: IArticle, cb: (err?: Error | string) => void) {
    if (!record.slug) {
      record.slug = slugify(`${record.name}`, { remove: /[*+~.()'"!:@\\\/]/g, lower: true, strict: true, locale: 'en' })
    }
    cb();
  },
};


const model = {
  primaryKey: "customId",
  attributes: attributes,
  ...methods,
};

module.exports = model;


declare global {
  /**
   * Here passed "id" field  for requireid on create instance of model
   */
  const Article: Model<typeof model>;
  interface Models {
    Article: IArticle;
  }



  /**
   * ⚠️ If you set custom id fields you should resolve it in global interface CustomPKs
   * This is due to the fact that most of the models work on id, and to simplify typing we do not display them
   * Although it is entirely possible to change the structure to the Models[M][primaryKey] volume to remove this global interface
   */
  interface CustomPKs {
    Article: 'customId';
  }

  /**
   * To assign the optionsArticleModel field to the desired type, you must complete the global interface
   * ⚠️ For different models with the same `'json'` property, there must be one type. 
   * In the current version, I haven't found a more elegant way to solve this.
   *  
   * If you have an idea please contact us, or make a github issue / PR in this repo
   */

  interface AppCustomJsonTypes {
    optionsArticleModel: OptionsArticleModel
  }
}
