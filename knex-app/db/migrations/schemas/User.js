const userSchema = (table) => {
    table.increments('id').primary().unique()
    table.string('name').notNullable()
    table.string('surname').notNullable()
    table.string('email').unique().notNullable()
    table.string('gender').notNullable()
    table.date('DOB').notNullable()
    table.string('contact_number')
    table.string('role').notNullable().defaultTo('guests')
    table.string('password').notNullable()
    table.integer('address_id').references('id').inTable('address').notNullable()
    table.timestamps(true, true)
}

module.exports = userSchema;