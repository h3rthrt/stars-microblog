function applyExtraSetup(sequelize) {
    const { 
        user, 
        note, 
        tag, 
        notesUsers,
        notesTags, 
        comment 
    } = sequelize.models

    user.hasMany(note, {
        onDelete: "cascade"
    })
    note.belongsTo(user, {
        author: {
            allowNull: false
        },
        onDelete: "cascade"
    })

    comment.hasMany(user)
    user.belongsTo(comment)

    comment.hasMany(note)
    note.belongsTo(comment)

    user.belongsToMany(note, {through: notesUsers})
    note.belongsToMany(user, {through: notesUsers})

    note.belongsToMany(tag, {through: notesTags})
    tag.belongsToMany(note, {through: notesTags})
    
}

module.exports = { applyExtraSetup }