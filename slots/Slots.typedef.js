const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # type query

  type Slot {
    slot_id: Int
    userId: String
    upLineId:String
    slotPlan_id: Int
    slot_plan: Int
    no_of_slots: Int
    total_amt: Int
  }

  # Input

  input CreateSlotInput {
    slot_id: Int
    userId: String
    upLineId:String
    slotPlan_id: Int
    slot_plan: Int
    no_of_slots: Int
    total_amt: Int
  }

  input UpdateSlotInput {
    slot_id: Int
    userId: String
    upLineId:String
    slotPlan_id: Int
    slot_plan: Int
    no_of_slots: Int
    total_amt: Int
    updated_at: String
  }

  # response

  type AdditionalDataType {
    error: Boolean
    status: Int
    message: String
  }

  type CreateSlotResponse {
    slot: Slot
    response: AdditionalDataType
  }

  # Query

  type Query {
    getAllSlot: [Slot]
    getSlotsById(id: ID!): Slot
  }

  # Mutation

  type Mutation {
    createSlot(slot: CreateSlotInput!): CreateSlotResponse
    updateSlot(slot: UpdateSlotInput!): CreateSlotResponse
  }
`;

module.exports = typeDefs;
