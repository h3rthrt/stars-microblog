
exports.up = function(knex) {
    return knex.schema.createTable('post', function (table) {
        table.increments()
        table.string('author')
        table.string('head', 60)
        table.string('text', 140)
    })
};

exports.down = function(knex) {
  
};
