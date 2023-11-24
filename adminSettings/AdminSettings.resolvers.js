const AdminSettings = require('./AdminSettings.model'); 

const resolvers = {
  Query: {
    getAdminSettings: async (_, { admin_id }) => {
      try {
        const adminSettings = await AdminSettings.findOne({ admin_id });
        return {
          success: true,
          data: adminSettings,
        };
      } catch (error) {
        return {
          success: false,
          error: `Error fetching admin settings: ${error.message}`,
        };
      }
    },
  },
  Mutation: {
    createAdminSettings: async (_, { input }) => {
      try {
        const adminSettings = await AdminSettings.create(input);
        return {
          success: true,
          data: adminSettings,
        };
      } catch (error) {
        return {
          success: false,
          error: `Error creating admin settings: ${error.message}`,
        };
      }
    },
    updateAdminSettings: async (_, { admin_id, input }) => {
      try {
        const adminSettings = await AdminSettings.findOneAndUpdate(
          { admin_id },
          { $set: input },
          { new: true }
        );
        return {
          success: true,
          data: adminSettings,
        };
      } catch (error) {
        return {
          success: false,
          error: `Error updating admin settings: ${error.message}`,
        };
      }
    },
  },
};

module.exports = resolvers;
