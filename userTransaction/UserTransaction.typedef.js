const { gql } = require("apollo-server-express");

const transactionTypeDefs = gql`
  type Transaction {
    _id: ID!
    userId: ID!
    amount: Float!
    status: String!
    createdAt: String!
  }

  input TopUpInput {
    userId: ID!
    amount: Float!
  }

  type Mutation {
    topUpWallet(input: TopUpInput): Transaction
  }
`;

module.exports = transactionTypeDefs;
