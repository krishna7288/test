const slotplans = require("./SlotPlans.model");

const slots_resolver = {
  Query: {
    getAllSlotPlans: async () => {
      try {
        const allSlots = await slotplans.find();
        return allSlots;
      } catch (error) {
        throw new Error(`Error fetching all slotplans: ${error.message}`);
      }
    },
    getSlotPlanById: async (_, { id }) => {
      try {
        const slotById = await slotplans.findById({id});
        return slotById;
      } catch (error) {
        throw new Error(`Error fetching slotplans by ID: ${error.message}`);
      }
    },
  },

  Mutation: {
    createSlotPlan: async (_, args) => {
      try {
        const { plan,slotplan_id } = args.slotPlan;
        const newSlot = new slotplans({ slotplan_id,plan });
        await newSlot.save();

        const sendResponse = {
          error: false,
          status: 200,
          message: "Slot Plan created successfully",
        };

        return {
          slotPlan: newSlot,
          response: sendResponse,
        };
      } catch (error) {
        throw new Error(`Error creating slot: ${error.message}`);
      }
    },

    updateSlotPlan: async (_, args) => {
      const { slotplan_id, plan, status, updated_at } = args.slotPlan;
      try {
        const updateSlots = await slotplans.updateOne(
          { slotplan_id: slotplan_id },
          {
            $set: {
              plan: plan,
              status: status,
              updated_at: updated_at,
            },
          }
        );

        if (updateSlots.nModified === 0) {
          throw new Error(`Slot Plan with ID ${id} not found`);
        }

        const sendResponse = {
          error: false,
          status: 200,
          message: "Slot Plan updated successfully",
        };

        return {
          user: updateSlots,
          response: sendResponse,
        };
      } catch (error) {
        throw new Error(`Error updating slot: ${error.message}`);
      }
    },
  },
};

module.exports = slots_resolver;
