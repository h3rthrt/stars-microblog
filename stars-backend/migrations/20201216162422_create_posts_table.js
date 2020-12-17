
exports.up = function(knex) {
    return knex.schema.createTable('posts', function (table) {
        table.increments()
        table.integer('user_id').unsigned().NotNullable()
        table.foreign('user_id').references('users.id').inTable('users')
        table.string('head', 60)
        table.string('text', 140)
        table.timestamps()
    })
};

exports.down = function(knex) {
  
};
