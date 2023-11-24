const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type AdminSettings {
    admin_id: String!
    club_joining_fee: Int
    withdraw_fee: Int
    internal_transaction_fee: Int
    spacer: Int
    withdraw_interval: Int
    allow_new_signup: Boolean
    allow_new_fcslot: Boolean
    maintenance_mode: Boolean
    referral_comm_firstslot: Int
    referral_comm_futureslot: Int
    change_password: String
    created_at: String
    updated_at: String
  }

  type additionalDataType {
    success:Boolean,
    data: AdminSettings
   }

  type Query {
    getAdminSettings(admin_id: String!): additionalDataType
  }

  type Mutation {
    createAdminSettings(input: AdminSettingsInput!): additionalDataType
    updateAdminSettings(admin_id: String!, input: AdminSettingsInput!): additionalDataType
  }

  input AdminSettingsInput {
    admin_id: String!
    club_joining_fee: Int
    withdraw_fee: Int
    internal_transaction_fee: Int
    spacer: Int
    withdraw_interval: Int
    allow_new_signup: Boolean
    allow_new_fcslot: Boolean
    maintenance_mode: Boolean
    referral_comm_firstslot: Int
    referral_comm_futureslot: Int
    change_password: String
  }
`;

module.exports = typeDefs;
