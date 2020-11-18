const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('user', {
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
                msg: "Email введен некорректно"
            }
        },
        nickname: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                max: 24,
                min: 3,
                msg: "Никнейм должен содержать от 3 до 24 символов"
            }
        },
        about: {
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                max: 140,
                msg: "Описание должно содержать не больше 140 символов"
            }
        },
        permissions: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
    })
}