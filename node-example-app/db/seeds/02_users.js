const bcrypt = require('bcryptjs');

exports.seed = function (knex) {
  return knex('user').insert(
    [
      {
        id: 1,
        name: 'admin',
        surname: 'admin',
        gender: 'admin',
        email: 'admin@gmail.io',
        DOB: "2002-06-30",
        contact_number: '0987654321',
        role: 'admin',
        password: bcrypt.hashSync('Password', bcrypt.genSaltSync(10)),
        address_id: 1,
      },
      {
        id: 2,
        name: 'James',
        surname: 'Bond',
        gender: 'male',
        email: 'jamesbond@example.com',
        DOB: "2002-06-30",
        contact_number: '0987654321',
        role: 'customer',
        password: bcrypt.hashSync('Password', bcrypt.genSaltSync(10)),
        address_id: 2,
      },
      {
        id: 3,
        name: 'John',
        surname: 'Wick',
        gender: 'other',
        email: 'johnwick@example.com',
        DOB: "2002-06-30",
        contact_number: '0987654321',
        role: 'customer',
        password: bcrypt.hashSync('Password', bcrypt.genSaltSync(10)),
        address_id: 3,
      }
    ]);
};