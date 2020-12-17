const { Model } = require('objection')
const db = require('../db')

Model.knex(db)

class Image extends Model {
    static get tableName() {
        return 'images'
    }
}

module.exports = Image