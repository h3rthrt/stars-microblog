const express = require('express')
const sequelize = require('./sequelize')
const app = express()
const PORT = process.env.PORT


async function databaseConnection() {
    console.log('Checking database connection...')
    try {
        await sequelize.authenticate()
        console.log('Database connection OK!!')

    } catch (e) {
        console.log(`Unable to connect to the database: ${e}`)
    }
}

async function init() {
    await databaseConnection()

    console.log(`Starting sequelize + express on port ${PORT}...`)
    
    sequelize.sync({ force: true })

    .catch((e) => {console.log(e)})

    app.listen(PORT, () => {
        console.log(`Server has been started on port ${PORT}..`)
    })
    console.log("All models were synchronized successfully.")
}

init()