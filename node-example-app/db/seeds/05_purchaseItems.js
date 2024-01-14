//seeds for purchase table
exports.seed = function (knex) {
    // Inserts seed entries
    return knex('purchaseItem').insert([
        {
            id: 1,
            purchase_id: 1,
            product_id: 1,
            quantity: 1,
        },
        {
            id: 2,
            purchase_id: 1,
            product_id: 2,
            quantity: 2,
        },
        {
            id: 3,
            purchase_id: 2,
            product_id: 2,
            quantity: 3,
        },
        {
            id: 4,
            purchase_id: 2,
            product_id: 3,
            quantity: 4,
        },
        {
            id: 5,
            purchase_id: 2,
            product_id: 4,
            quantity: 1,
        },
        {
            id: 6,
            purchase_id: 3,
            product_id: 1,
            quantity: 1,
        },
        {
            id: 7,
            purchase_id: 3,
            product_id: 2,
            quantity: 2,
        },
    ]).then(function () {
        return knex.schema.raw('ALTER SEQUENCE "purchaseItem_id_seq" RESTART WITH 8')
    });
}