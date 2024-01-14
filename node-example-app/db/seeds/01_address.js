exports.seed = function (knex) {
  // Inserts seed entries
  return knex('address').insert([
    {
      id: 1,
      street: "first",
      suburb: "sub",
      city: "city",
      code: '0001'
    },
    {
      id: 2,
      street: "10 Downing Street",
      suburb: "Westminster",
      city: "London",
      code: 'SW1A 2AA'
    },
    {
      id: 3,
      street: "1 Main Street",
      suburb: "New York",
      city: "New York",
      code: '10001'
    },
  ]).then(function () {
    return knex.schema.raw('ALTER SEQUENCE address_id_seq RESTART WITH 4')
  });
};