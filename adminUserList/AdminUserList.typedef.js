const { gql } = require("apollo-server-express");

const adminUserListTypeDefs = gql`

type SlotStatus {
    status: Int
  }


  type Wallet {
    mainWallet: Float!
    reserveWallet: Float!
  }

  type User {
    userId: String!
    name: String!
    emailId: String!
    createdAt: Date!
    upLineId: String!
    wallet: Wallet!
    slotStatus: SlotStatus
  }

  type Date {
    value: String
  }

  type Query {
    adminUserList: [User]!
  }
`;

module.exports = adminUserListTypeDefs;
