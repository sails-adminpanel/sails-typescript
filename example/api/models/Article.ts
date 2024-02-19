import { Attributes,  ModelTypeDetection, Model } from "../../../waterline";
import { v4 as uuid } from "uuid";
import slugify from "slugify"

export interface OptionsArticleModel {
  first: boolean
  second: string
}

/**
 * Define sails prject model 
 * 
 * When you define model by this template, you should also add 
 * this model in `ProjectModel` type `types/projectModels.d.ts`
 *  */ 

// Define Attributes
export default Article;
interface Article extends Partial<ModelOptions> {}
type ModelOptions = ModelTypeDetection<typeof attributes>
let a: Attributes;
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
  } as const,
  price: {
    type: "number",
    required: true
  },
  slug:{
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
  beforeCreate(record: Article, cb: (err?: Error | string) => void) {
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
  primaryKey: "id",
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
    Article: Article;
  }
}

