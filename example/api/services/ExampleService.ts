import axios from "axios";
import { ArticleInstance } from "../models/Article";



let service = {

  async exec(domain: string, name: string): Promise<ArticleInstance> {
    let example;

    let a = await Category.create({"name": "test"}).fetch()
    let b = await Category.find({"where": {id: "123"}})
    let b0 = await Category.find( {id: "123"})
    let b1 = await Category.findOne("test")
    b1.id
    // !TODO: over load work not correctly
    let w1 = await Article.findOne({id: "123"}).populate("links").populate("category");
    let c = await Category.findOne({"id": "test"}).populate("articles")
    let c4 = await Category.findOne({"id": "test"}).populate("articles")
    let w =  (await Article.find({id: "123"})).shift();
    
    // w This is custom type (AppCustomJsonTypes)
    w.optionsArticleModel
    

    // !TODO: links should  accept only number array
    await Article.create({price: 123, requiredOption: true, links: [123,345]}).fetch() 

  //  await Article.update("123", { category: [123,345]}).fetch() 
    
    try {

      example = await axios.post(domain, {
        name: name
      });
      return example.data;
    } catch (err) {
      return err;
    }
  }
}

module.exports = {
  ...service
}

declare global {
  const ExampleService: typeof service;
}
