const Post = require('../../models/post')

module.exports = {
    get20Posts: async (obj, args, context, info) => {
        return Post
            .query()
            .orderBy('user.created_at')
            .eager('user', 'image', 'stats')
            .limit(20)
    }
}