// resolvers/resolvers_index.js
const { mergeResolvers } = require("@graphql-tools/merge");
const user_resolvers = require("./user/User.resolvers");
const slotPlans_resolver = require("./slotPlan/SlotPlans.resolver");
const slots_resolver = require("./slots/Slots.resolver");
const adminSettings_resolver = require("./adminSettings/AdminSettings.resolvers");
const adminWallet_resolver = require("./adminWallet/AdminWallet.resolver");
const adminDashboard_resolver = require("./adminDashboard/AdminDashboard.resolver");
const adminUserList_resolver = require("./adminUserList/AdminUserList.resolver");
const UserTransaction_resolver = require("./userTransaction/UserTransaction.resolver")

const resolvers = [
  user_resolvers,
  slotPlans_resolver,
  slots_resolver,
  adminSettings_resolver,
  adminWallet_resolver,
  adminDashboard_resolver, 
  adminUserList_resolver,
  UserTransaction_resolver,
];

module.exports = mergeResolvers(resolvers);
