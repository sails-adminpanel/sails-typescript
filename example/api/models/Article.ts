import { Attributes, ModelTypeDetection, Model } from "sails-typescript";
import { v4 as uuid } from "uuid";
import slugify from "slugify"

export interface OptionsArticleModel {
  first: boolean
  second: string
}

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

  optionsArticleModel: {
    type: "json",
  },
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
    let a = record.optionsArticleModel
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
  interface CustomTypes {
    optionsArticleModel: OptionsArticleModel
  }
}

