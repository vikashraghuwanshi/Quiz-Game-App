const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const connectMongoDB = require("./db");
const schema = require("./graphql/schema");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongoDB();

// Setup GraphQL API
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enables GraphiQL for testing
  })
);

module.exports = app;
