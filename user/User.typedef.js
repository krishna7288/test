const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload
  # type query

  type User {
    id: ID
    userId: String
    name: String
    emailId: String
    profilePicture: String
    upLineId: String
    usdtAddress: String
    accessToken: String
    firstReferralPercentage:Boolean
  }

  # Input

  input ReferralInput {
    upLineId: String!
  }

  input updateUserInput {
    id: ID
    userId: String
    name: String
    emailId: String
    profilePicture: String
    upLineId: String
    usdtAddress: String
  }

  input CreateUserInput {
    name: String!
    emailId: String!
    upLineId: String!
    otp: Int!
  }

  input CreateOtpForUserInput {
    name: String!
    emailId: String!
    upLineId: String!
  }

  input VerifyOtpInput {
    emailId: String!
    otp: Int!
  }

  input verifyMailInput {
    emailId: String!
  }

  # response

  type AdditionalDataType {
    error: Boolean
    status: Int
    message: String
  }

  type CreateUserResponse {
    user: User
    response: AdditionalDataType
  }

  type updateUser {
    id: ID
    userId: String
    name: String
    emailId: String
    upLineId: String
    usdtAddress: String
  }

  type updateUserResponse {
    user: updateUser
    response: AdditionalDataType
  }

  type ReferralUserResponse {
    referralUser: User
    response: AdditionalDataType
  }

  type OtpForUserResponse {
    response: AdditionalDataType
  }

  type getMyReferralResponse {
    id: ID
    name: String
    emailId: String
    userId: String
    # profilePicture: Upload # Consider changing to Upload for file uploads
    response: AdditionalDataType
  }

  type File {
    filename: String
    mimetype: String
    encoding: String
  }

  # Query

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    myReferral(userId: String!): [getMyReferralResponse]
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }

  # Mutation

  type Mutation {
    createUser(user: CreateUserInput!): CreateUserResponse
    updateUser(user: updateUserInput!): updateUserResponse
    UserReferralVerify(referralVerify: ReferralInput!): ReferralUserResponse
    createOtpForUser(otpForUser: CreateOtpForUserInput!): OtpForUserResponse
    loginMailVerifyAndSendOtp(verifymail: verifyMailInput): OtpForUserResponse
    loginAuthVerify(verifyOtp: VerifyOtpInput!): CreateUserResponse
  }
`;

module.exports = typeDefs;
