const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('comment', {
        text: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                max: 140,
                msg: "Максимальное количество символов 140"
            }
        },
    })
}