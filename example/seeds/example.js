const faker = require("faker");
exports.default = async function (sails) {
  await Example.destroy({});
  for await (let i of [1, 2, 3, 4, 5]) {
    await Example.create({
      name: faker.name.firstName(),
      price: faker.random.price,
      requiredOption: true,
      options: faker.random.objectElement(),
    }).fetch();
  }
}
