const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Query {}
    input UserInput {
        nickname: String!
        avatar: String
    }
    input ImageInput {
        image: String!
    }
    input StatsInput {
        like: Boolean!
    }
    input PostInput {
        head: String
        text: String
    }
    type User {
        id: ID
        nickname: String
        avatar: String
    }
    type Image {
        id: ID
        image: String
    }
    type Stats {
        id: ID
        like: Boolean
    }
    type Post {
        id: ID
        author: User
        images: [Image]
        head: String
        text: String
        likes: [Stats]
    }
`

module.exports = typeDefs