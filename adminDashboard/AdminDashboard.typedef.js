const { gql } = require('apollo-server-express');

const typeDefs = gql`
type AdminWallet {
  totalBalance: Float!
  todayBalance: Float!
  totalCommission: Float!
  todayCommission: Float!
}

  type Wallet {
    mainWallet: Float!
    reserveWallet: Float!
    totalWallet: Float!
  }

  type Dashboard {
    totalUsers: Int!
    todayUsers: Int!
    totalWalletData: Wallet!
    adminWalletData: AdminWallet!
  }

  type Query {
    getDashboardStatus: Dashboard!
  }
`;

module.exports = typeDefs;
