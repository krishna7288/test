const User = require('../user/User.model'); 
const Wallet = require('../wallets/Wallet.model'); 
const AdminWallet = require('../adminWallet/AdminWallet.model')

const resolvers = {
    Query: {
      getDashboardStatus: async () => {
        try {
          // Get total user count
          const totalUsers = await User.countDocuments();
  
          // Get today's user count
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
  
          const todayUsers = await User.countDocuments({
            createdAt: { $gte: todayStart },
          });
  
          // Get total main wallet, reserve wallet, and total wallet data
          const totalMainWallet = await Wallet.aggregate([
            { $group: { _id: null, totalMainWallet: { $sum: '$mainWallet' } } },
          ]);
  
          const totalReserveWallet = await Wallet.aggregate([
            { $group: { _id: null, totalReserveWallet: { $sum: '$reserveWallet' } } },
          ]);


          // Get total and today admin wallet balance and commission
        const totalAdminWalletBalance = await AdminWallet.aggregate([
          { $group: { _id: null, totalBalance: { $sum: '$admin_wallet_balance' } } },
        ]);

        const todayAdminWalletBalance = await AdminWallet.aggregate([
          { $match: { created_at: { $gte: todayStart } } },
          { $group: { _id: null, todayBalance: { $sum: '$admin_wallet_balance' } } },
        ]);

        const totalAdminCommission = await AdminWallet.aggregate([
          { $group: { _id: null, totalCommission: { $sum: '$admin_commision' } } },
        ]);

        const todayAdminCommission = await AdminWallet.aggregate([
          { $match: { created_at: { $gte: todayStart } } },
          { $group: { _id: null, todayCommission: { $sum: '$admin_commision' } } },
        ]);

  
        const formatDecimal = (value) => {
          return parseFloat(value.toFixed(4));
        };
        
        const totalWalletData = {
          mainWallet: totalMainWallet.length ? formatDecimal(totalMainWallet[0].totalMainWallet) : 0,
          reserveWallet: totalReserveWallet.length ? formatDecimal(totalReserveWallet[0].totalReserveWallet) : 0,
          totalWallet: totalMainWallet.length && totalReserveWallet.length
            ? formatDecimal(totalMainWallet[0].totalMainWallet + totalReserveWallet[0].totalReserveWallet)
            : 0,
        };
        
        const adminWalletData = {
          totalBalance: totalAdminWalletBalance.length ? formatDecimal(totalAdminWalletBalance[0].totalBalance) : 0,
          todayBalance: todayAdminWalletBalance.length ? formatDecimal(todayAdminWalletBalance[0].todayBalance) : 0,
          totalCommission: totalAdminCommission.length ? formatDecimal(totalAdminCommission[0].totalCommission) : 0,
          todayCommission: todayAdminCommission.length ? formatDecimal(todayAdminCommission[0].todayCommission) : 0,
        };
        
  
          return {
            totalUsers,
            todayUsers,
            totalWalletData,
            adminWalletData,
          };
        } catch (error) {
          throw new Error('Error fetching dashboard stats');
        }
      },
    },
  };
module.exports = resolvers;
