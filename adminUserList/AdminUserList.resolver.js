const User = require("../user/User.model")
const Wallet = require("../wallets/Wallet.model");
const Slot = require('../slots/Slots.model');

const adminUserListResolver = {
    Query: {
      adminUserList: async () => {
        try {
          const users = await User.find({}, "userId name emailId createdAt upLineId");
          const wallets = await Wallet.find({}, "userId mainWallet reserveWallet");
          const slots = await Slot.find({}, "userId status");
  
          const userMap = users.reduce((acc, user) => {
            acc[user.userId] = {
              ...user._doc,
              wallet: null,
              slotStatus: null, // Initialize slot status to null
            };
            return acc;
          }, {});
  
          wallets.forEach(wallet => {
            if (userMap[wallet.userId]) {
              userMap[wallet.userId].wallet = {
                mainWallet: wallet.mainWallet,
                reserveWallet: wallet.reserveWallet,
              };
            }
          });
  
          slots.forEach(slot => {
            if (userMap[slot.userId]) {
              userMap[slot.userId].slotStatus = {
                status: slot.status,
              };
            }
          });
  
          const formattedUsers = Object.values(userMap).map(user => ({
            ...user,
            createdAt: { value: user.createdAt.toISOString() },
          }));
  
          return formattedUsers;
        } catch (error) {
          throw new Error("Error fetching admin user list");
        }
      },
    },
  };
  
  module.exports = adminUserListResolver;
