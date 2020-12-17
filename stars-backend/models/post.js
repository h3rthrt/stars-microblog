const { Model } = require('objection')
const db = require('../db')
const Image = require('./image')
const User = require('./user')

Model.knex(db)

class Post extends Model {
    static get tableName() {
        return 'posts'
    }

    $beforeInsert() {
        this.created_at = new Date().toISOString()
    }

    static get relationMapping() {
        return {
            relation: Model.HasManyRelation,
            modelClass: Image,
            join: {
                from: 'posts.id',
                to: 'images.post_id'
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



module.exports = Post
