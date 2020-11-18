const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('note', {
        picture: {
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        text: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                max: 140,
                msg: "Максимальное количество символов 140"
            }
        },
        date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        
        private: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
    })
}