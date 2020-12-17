const { Model } = require('objection')
const db = require('../db')
const Post = require('./post')
const User = require('./user')

Model.knex(db)

class Stats extends Model {
    static get tableName() {
        return 'stats'
    }

    static get relationMappings() {
        return {
            post: {
                relation: Model.BelongsToOneRelation,
                modelClass: Post,
                join: {
                    from: 'stats.post_id',
                    to: 'posts.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'stats.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Stats
