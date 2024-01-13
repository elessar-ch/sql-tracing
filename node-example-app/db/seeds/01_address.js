exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('address').del()
    .then(function () {
      // Inserts seed entries
      return knex('address').insert([
        {
          id: 1,
          street: "first",
          suburb: "sub",
          city: "city",
          code: '0001'
        }
      ]);
    });
};