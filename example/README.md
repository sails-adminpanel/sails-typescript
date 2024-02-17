<p align="center">
  <img src="./assets/images/starter_logo.png" alt="sails-typescript-starter">
</p>

# Sails TypeScript starter
a [Sails v1](https://sailsjs.com) application starter



## SailsJS Discord community
**Community Link:** [Join SailsJS Discord Community](https://discord.gg/VDH2yT6C)
Feel free to use this link to connect with the community and engage in discussions or ask any questions you may have.


## Sails Models Typescript

### Add model
**Model generator** 

```
npx gulp generate --model NewModelName
```

**Manual**

Define sails prject model 
When you define model by example in `api/models`, you should also add this model in Type `ProjectModel` into file `types/projectModels.d.ts`

example:
```
  import ModelName from "../api/models/ModelName";

  type ProjectModels = {
    ModelName: ModelName
  }
```

For add custom type (ex: OptionsArticleModel in Article model) for json type Field you should import you type in `types/customTypes.d.ts` file, and assign your type for key with same name (case sensitive) as your json type field

> ⚠️ For different models with the same `'json'` property, there must be one type.  In the current version, I haven't found a more elegant way to solve this. If you have an idea or realisation please contact us, or make a github issue / PR in this repo


## ENV variables

`DB_MIGRATE` = `'drop'` | `'safe'` | `'dropfile'` 

**drop** & **safe** by [documentation sailsjs](https://sailsjs.com/documentation/concepts/models-and-orm/model-settings#?how-automigrations-work) 

**dropfile** - when file ./.tmp/dropfile exist then migrate: drop, after execute dropfile to be delited

> migration `alter` was blocked;


##### About ExampleService
ExampleService makes post request to some url, but in test
mode instead of going to real url, we substitute the response
with data-mock server. To do that we put a data-mock-server's
scenario in `test/datamocks` and run the server in `bootstrap`
file  using this scenario.

# Declare sails config options

```
declare global {
	interface ISailsConfig {
		test: {
			let1: 123
		}
	}
}
```