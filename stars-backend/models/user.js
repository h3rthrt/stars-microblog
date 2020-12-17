const { Model } = require('objection')
const db = require('../db')
const Post = require('./post')
const Stats = require('./stats')

Model.knex(db)

class User extends Model {
    static get tableName() {
        return 'users'
    }
}

module.exports = User