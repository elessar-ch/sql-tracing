exports.seed = function (knex) {
    // Inserts seed entries
    return knex('purchaseItem').del()
        .then(function () {
            return knex('purchase').del()
        }).then(function () {
            return knex('cartItem').del()
        }).then(function () {
            return knex('product').del()
        }).then(function () {
            return knex('user').del()
        }).then(function () {
            return knex('address').del()
        });
};