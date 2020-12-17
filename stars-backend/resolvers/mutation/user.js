const User = require('../../models/user')

module.exports = {
  findOrCreateUser: async (obj, { user }, context, info) => {
    const normalizedUser = { nickname: user.nickname.toLocaleLowerCase() };
    const userFromDB = await User.query().findOne(normalizedUser);
    if (!userFromDB) {
      return  User
        .query()
        .insert(normalizedUser)
    }
    return userFromDB
  }
}