/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('product', require('./schemas/Product'))
        .createTable('purchase', require('./schemas/Purchase'))
        .createTable('purchaseItem', require('./schemas/PurchaseItem'))
        .createTable('cartItem', require('./schemas/CartItem'))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('purchaseItem')
        .dropTableIfExists('purchase')
        .dropTableIfExists('cartItem')
        .dropTableIfExists('product')
};
