const User = require('../../models/user')

module.exports = {
    get20Users: async (obj, args, context, info) => {
        return User
            .query()
            .orderBy('created_at')
            .eager('post')
            .limit(20)
    }
}