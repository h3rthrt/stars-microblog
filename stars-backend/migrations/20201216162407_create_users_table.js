
exports.up = function(knex) {
    return knex.schema.createTable('user', function (table) {
        table.increments()
        table.string('nickname').unique()
        table.string('avatar')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user')
};
