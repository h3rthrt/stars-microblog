
exports.up = function(knex) {
    return knex.schema.createTable('stats', function (table) {
        table.increments()
        table.integer('user_id').unsigned().notNullable()
        table.integer('post_id').unsigned().notNullable()
        table.boolean('like')
        table.foreign('user_id').references('users.id').inTable('users')
        table.foreign('post_id').references('posts.id').inTable('posts')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
