const purchaseItemSchema = (table) => {
    table.increments('id').primary().unique()
    table.integer('purchase_id').references('id').inTable('purchase').notNullable()
    table.integer('product_id').references('id').inTable('product').notNullable()
    table.integer('quantity').notNullable()
    table.timestamps(true, true)
}

module.exports = purchaseItemSchema;