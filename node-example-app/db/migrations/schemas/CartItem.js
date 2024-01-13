const cartItemSchema = (table) => {
    table.increments('id').primary();
    table.integer('product_id').references('id').inTable('product').notNullable();
    table.integer('user_id').references('id').inTable('user').notNullable();
    table.integer('quantity');
    table.timestamps(true, true);
}

module.exports = cartItemSchema;