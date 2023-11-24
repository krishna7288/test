const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # type query

  type SlotPlan {
    slotplan_id: ID!
    plan: Int
  }

  # Input

  input CreateSlotPlanInput {
    slotplan_id: Int!
    plan: Int!
  }

  input UpdateSlotPlanInput {
    plan: Int!
    status: Int
    updated_at: String
  }

  # response

  type AdditionalDataType {
    error: Boolean
    status: Int
    message: String
  }

  type CreateSlotPlanResponse {
    slotPlan: SlotPlan
    response: AdditionalDataType
  }

  # Query

  type Query {
    getSlotPlanById(id: ID!): SlotPlan
    getAllSlotPlans: [SlotPlan]
  }

  # Mutation

  type Mutation {
    createSlotPlan(slotPlan: CreateSlotPlanInput!): CreateSlotPlanResponse
    updateSlotPlan(slotPlan: UpdateSlotPlanInput!): CreateSlotPlanResponse
  }
`;

module.exports = typeDefs;
