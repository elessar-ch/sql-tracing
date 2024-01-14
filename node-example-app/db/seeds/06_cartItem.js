exports.seed = function (knex) {
    //insert seed entries
    return knex('cartItem').insert([
        {
            id: 1,
            user_id: 2,
            product_id: 1,
            quantity: 1,
        }
    ]).then(function () {
        return knex.schema.raw('ALTER SEQUENCE "cartItem_id_seq" RESTART WITH 4')
    });
}