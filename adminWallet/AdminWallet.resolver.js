const AdminWallet = require('./AdminWallet.model');

const resolvers = {
  Query: {
    getAdminWallet: async (_, { adminId }) => {
      try {
        const adminWallet = await AdminWallet.findOne({ admin_id: adminId });
        return adminWallet;
      } catch (error) {
        throw new Error(`Error while fetching admin wallet: ${error.message}`);
      }
    },
  },
  Mutation: {
    createAdminWallet: async (_, { input }) => {
      try {
        const adminWallet = new AdminWallet(input);
        const result = await adminWallet.save();
        return result;
      } catch (error) {
        throw new Error(`Error while creating admin wallet: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
