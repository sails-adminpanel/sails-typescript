/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

//@ts-ignore
const fs = require('fs');
const path = require('path');

const relations: any = []

module.exports.bootstrap = async function () {

  /**
   * # Bootsrap seeds from seeds folder
   * Magic: filename.json where filename is model name
   */

  if (sails.config.models.migrate === 'drop' || process.env.FORCE_SEED === 'TRUE') {
    sails.log.info('Seeding 🌱 process start');
    try {
      let seedsDir = process.env.SEED_PATH ? process.env.SEED_PATH : __dirname + '/../seeds/';
      // load JSON data
      let seeds = fs.readdirSync(seedsDir).filter((file: any) => {
        return path.extname(file).toLowerCase() === '.json';
      });

      for await (let seed of seeds) {
        try {
          let seedFile = seedsDir + seed;
          let model = seed.split('.')[0].toLowerCase();
          let jsonSeedData = require(seedFile);

          sails.log.info('🌱 Bootstrap > Seed for model: ', model);

          if (sails.models[model]) {
            await sails.models[model].destroy({}).fetch();
            if (Array.isArray(jsonSeedData)) {
              for await (const seedItem of jsonSeedData) {
                await create(model, seedItem)
              }
              sails.log.debug(`🌱 Bootstrap seed ${model}: > count: ${jsonSeedData.length}`);
            } else {
              sails.log.debug(`🌱 Bootstrap seed ${model}: > one item`);
              await create(model, jsonSeedData)
            }
            sails.log.info(`Bootstrap seed model: > ${model} was seeded, count: ${jsonSeedData.length}`);
          } else {
            sails.log.warn(`Bootstrap seed model: > ${model} SKIPED (model not present in sails)`);
          }
        } catch (error) {
          sails.log.error(`🌱 Seeding error: ${error}`);
        }
      }

      /**
       * Start load JS seed files
       */ 
      seeds = fs.readdirSync(seedsDir).filter((file: any) => {
        return path.extname(file).toLowerCase() === '.js';
      });

      // If file .queue exist then sort seedqueue by this file
      if (fs.existsSync(seedsDir + '.queue')) {
        var queuelist = fs
          .readFileSync(seedsDir + '.queue')
          .toString()
          .split('\n')
          .filter((v: any) => v);
        let _seeds = [...seeds];
        seeds = [];

        // Build head loadlist of js seeds files
        queuelist.forEach((qItem: any) => {
          _seeds.forEach((sItem) => {
            if (sItem.includes(qItem)) {
              seeds.push(sItem);
            }
          });
        });

        // Build foot
        seeds = [...seeds, ..._seeds.filter((n) => !seeds.includes(n))];
      }

      for await (let seed of seeds) {
        let model = seed.split('.')[0].toLowerCase();
        sails.log.info('🌱 Bootstrap > Seed for model: ', model);

        let seedFile = seedsDir + seed;
        if (sails.models[model]) {
          await sails.models[model].destroy({}).fetch();
          if (fs.existsSync(seedFile)) {
            let bootstrapModelSeed = require(seedFile);
            await bootstrapModelSeed.default(sails);
            sails.log.debug(`🌱 Bootstrap seed ${model}`);
          }
          sails.log.info(`Bootstrap seed model: > ${model} was seeded from .js file`);
        } else {
          sails.log.warn(`Bootstrap seed model: > ${model} SKIPED (model not present in sails)`);
        }
      }
      // Finish load JS seed files

      /**
       * Seeding models relations
       *  */ 

      for( const relation of relations){
        if (!relation.value) {
          sails.log.error(`Relation value not defined!!! ${JSON.stringify(relation)}`)
        }
        // find relation target
        const criteria: any = {};
        if(relation.value.slug){
          criteria.slug = relation.value.slug;
        } else {
          sails.log.error(`Slug field not found ${JSON.stringify(relation)}`)
        }
        
        console.log(relation)
        if(Object.keys(criteria).length) {
          let found = await sails.models[relation.targetModel].findOne(criteria)
          if(found) {
            if(relation.type === "collection"){
              await sails.models[relation.model].addToCollection(relation.id, relation.key).members(found.id);
            } else {
              let update: any = {};
              update[relation.key] = found.id
              await sails.models[relation.model].update({id: relation.id}, update);
            }
          }
        }
      }

    } catch (error) {
      console.error('Bootstrap seeds error: > ', error);
    }
  }

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
} as Sails['config']['bootstrap'];


function cleanSeedItem(model: string | number, seedItem: { [s: string]: unknown; } | ArrayLike<unknown>) {
  const attributes = sails.models[model].attributes
  for (let attribute in attributes) {
    // @ts-ignore
    if (Object.keys(attributes[attribute]).includes('collection') && seedItem[attribute]) {
      // @ts-ignore
      delete seedItem[attribute]
    }
    // @ts-ignore
    if (Object.keys(attributes[attribute]).includes('model') && seedItem[attribute]) {
      // @ts-ignore
      delete seedItem[attribute]
    }
  }
  
  // @ts-ignore
  if(seedItem.createdAt) {delete(seedItem.createdAt);}
  // @ts-ignore
  if(seedItem.updatedAt) {delete(seedItem.updatedAt);}
  // @ts-ignore
  if(typeof seedItem.id === 'number') delete(seedItem.id);

  for (const [key, value] of Object.entries(seedItem)) {
    if (value === null || value === undefined)  {
      // @ts-ignore
      delete(seedItem[key]);
    } else {
      try {
        // @ts-ignore
        let jsonValue = JSON.parse(value);
        // @ts-ignore
        seedItem[key] = jsonValue;
      } catch (e) {
      }
    }
  }
}


async function create(model: string | number, seedItem: { [x: string]: any; }) {
  let cleanedSeedItem = {...seedItem};
  cleanSeedItem(model, cleanedSeedItem);
  let createdInstance = await sails.models[model].create(cleanedSeedItem).fetch();

  const attributes = sails.models[model].attributes
  for (let attribute in attributes) {
    if (Object.keys(attributes[attribute]).includes('collection') && seedItem[attribute]) {
      for (let relItem of seedItem[attribute]) {
        let rel = {
          id: createdInstance.id,
          model: model,
          targetModel: attributes[attribute].collection,
          type: "collection",
          key: attribute,
          value: { ...relItem}
        }
        relations.push(rel)
      }
      delete seedItem[attribute]
    }
    if (Object.keys(attributes[attribute]).includes('model') && seedItem[attribute]) {
      let rel = {
        id: createdInstance.id,
        model: model, 
        targetModel: attributes[attribute].model,
        type: 'model',
        key: attribute,
        value: { ...seedItem[attribute] }
      }
      relations.push(rel)
      delete seedItem[attribute]
    }
  }
}