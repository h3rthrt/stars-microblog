const Post = require('../../models/post')

module.exports = {
    createPost: async (obj, { head }, { text }, context, info) => {
        const createdPost = await Post.query().insert({
            head: head,
            text: text 
        })

        const resultPost = await Post
            .query()
            .eager('user', 'image', 'stats')
            .findById(createdPost.id)
        return resultPost
    }
}