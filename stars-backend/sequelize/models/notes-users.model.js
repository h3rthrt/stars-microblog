const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('notesUsers', {
        like: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
        repost: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
    })
}