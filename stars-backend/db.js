const db = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '5432',
        user: 'admin',
        password: '123456',
        database: 'stars'
    }
})

module.exports = db