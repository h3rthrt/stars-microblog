const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = require('./graphql/graphqlSchema');

const server = new ApolloServer({typeDefs});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
