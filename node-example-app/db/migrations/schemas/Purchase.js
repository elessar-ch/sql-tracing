const purchaseSchema = (table) => {
    table.increments('id').primary().unique()
    table.integer('user_id').references('id').inTable('user').notNullable()
    table.timestamp('datetime').notNullable()
    table.timestamps(true, true)
}

module.exports = purchaseSchema;