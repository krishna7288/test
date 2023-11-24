const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type AdminWallet {
    admin_wallet_balance: Float
    admin_commision: Float
    admin_id: String
    created_at: String
    updated_at: String
  }

  input AdminWalletInput {
    admin_wallet_balance: Float
    admin_commision: Float
    admin_id: String
  }

  type Query {
    getAdminWallet(adminId: String!): AdminWallet
  }

  type Mutation {
    createAdminWallet(input: AdminWalletInput): AdminWallet
  }
`;

module.exports = typeDefs;
