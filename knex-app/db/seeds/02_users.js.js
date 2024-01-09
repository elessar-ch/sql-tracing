const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('Password', salt);

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
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
            password: hash,
            address_id: 1,
          }
        ]);
    });
};