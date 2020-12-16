
exports.up = function(knex) {
    return knex.schema.createTable('stats', function (table) {
        table.increments()
        table.integer('user_id').unsigned().notNullable()
        table.integer('post_id').unsigned().notNullable()
        table.boolean('like')
        table.foreign('user_id').references('user.id').inTable('user')
        table.foreign('post_id').references('post.id').inTable('post')
    })
};

exports.down = function(knex) {
  
};
