//seeds for purchase table
exports.seed = function (knex) {
    // Inserts seed entries
    return knex('purchase').insert([
        {
            id: 1,
            user_id: 2,
            datetime: "2023-06-29 12:00:00",
        },
        {
            id: 2,
            user_id: 2,
            datetime: "2023-06-30 12:00:00",
        },
        {
            id: 3,
            user_id: 3,
            datetime: "2023-06-30 12:00:00",
        }
    ]);
}
