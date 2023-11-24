// typedefs/typedefs_index.js
const { mergeTypeDefs } = require("@graphql-tools/merge");
const userTypeDefs = require("./user/User.typedef");
const slotPlansTypeDefs = require("./slotPlan/SlotPlans.typedef");
const slotsTypeDefs = require("./slots/Slots.typedef");
const adminSettingsTypeDefs = require("./adminSettings/AdminSettings.typedef")
const adminWalletTypeDefs = require('./adminWallet/AdminWallet.typedef')
const adminDashboardTypeDef = require('./adminDashboard/AdminDashboard.typedef')
const adminUserListTypeDef = require('./adminUserList/AdminUserList.typedef')
const userTransactionTypeDef = require('./userTransaction/UserTransaction.typedef')

const typedefs = [
     userTypeDefs,
     slotPlansTypeDefs, 
     slotsTypeDefs, 
     adminSettingsTypeDefs, 
     adminWalletTypeDefs, 
     adminDashboardTypeDef,
     adminUserListTypeDef,
     userTransactionTypeDef
     ];

module.exports = mergeTypeDefs(typedefs);
