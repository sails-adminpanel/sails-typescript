<p align="center">
  <img src="./assets/images/starter_logo.png" alt="sails-typescript-starter">
</p>

# Sails TypeScript starter
a [Sails v1](https://sailsjs.com) application starter



## SailsJS Discord community
**Community Link:** [Join SailsJS Discord Community](https://discord.gg/NR5qrQEYpP)
Feel free to use this link to connect with the community and engage in discussions or ask any questions you may have.


## Sails Models Typescript

### Add model
**Model generator** 

```
npx gulp generate --model NewModelName
```

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