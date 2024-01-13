const productSchema = (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.decimal('price');
    table.string('image');
    table.integer('stock');
    table.timestamps(true, true);
}

module.exports = productSchema;