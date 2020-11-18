const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('tag', {
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                max: 32,
                min: 2,
                msg: "Описание тега не должно быть больше 32 символа или меньше 2"
            }
        },
        color: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                max: 7
            }
        },
    })
}