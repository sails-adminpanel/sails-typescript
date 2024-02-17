import axios from "axios";
import Article from "../models/Article";

let service = {

  async exec(domain: string, name: string): Promise<Article> {
    let example;

    let a = await Category.create({"id": "test"}).fetch()
    let b = await Category.find({"where": {id: "123"}})
    let b0 = await Category.find( {id: "123"})
    let b1 = await Category.find("test")
    let c = await Category.findOne({"id": "test"})//.populate("articles")
    

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
