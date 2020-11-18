const { Sequelize } = require('sequelize')
const { applyExtraSetup } = require('./extra-setup')

const sequelize = new Sequelize(process.env.DATABASE_URL)
   
    const modelDefiners = [
        require('./models/comment.model'),
        require('./models/note.model'),
        require('./models/notes-tags.model'),
        require('./models/notes-users.model'),
        require('./models/tag.model'),
        require('./models/user.model'),
    ]
    
    for (const modelDefiner of modelDefiners) {
        modelDefiner(sequelize)
    }
    
    applyExtraSetup(sequelize)
    
    


module.exports = sequelize