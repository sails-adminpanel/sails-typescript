describe('Migrtions', () => {
  it('read from all models', async () =>  {
    for (let model in sails.models) {
      await sails.models[model].find({});
    }
  });
});
