const axios = require("axios");
const TransactionModel = require("./UserTransaction.model");
const WalletModel = require("../wallets/Wallet.model");
// const UserModel = require("./user.model");

const COINPAYMENTS_API_KEY = "YOUR_COINPAYMENTS_API_KEY";
const COINPAYMENTS_API_SECRET = "YOUR_COINPAYMENTS_API_SECRET";

const resolvers = {
  Mutation: {
    topUpWallet: async (_, { input }) => {
      try {
        // Assuming input contains userId and amount
        const { userId, amount } = input;

        // Create a transaction record
        const transaction = await TransactionModel.create({
          userId,
          amount,
          status: "pending",
        });

        // Prepare CoinPayments API request
        const coinPaymentsRequest = {
          key: COINPAYMENTS_API_KEY,
          cmd: "_pay_simple",
          amount: amount,
          currency1: "USD",
          currency2: "USD",
          buyer_email: "buyer@example.com",
          item_name: "Wallet Top-Up",
          item_number: transaction._id.toString(), // Unique identifier for the transaction
          ipn_url: "YOUR_IPN_CALLBACK_URL", // URL for receiving payment notifications
        };

        // Make a request to CoinPayments API
        const coinPaymentsResponse = await axios.post(
          "https://www.coinpayments.net/api.php",
          coinPaymentsRequest
        );

        // Check if the request to CoinPayments was successful
        if (coinPaymentsResponse.data.error === "ok") {
          // Redirect the user to the CoinPayments checkout URL
          const checkoutUrl = coinPaymentsResponse.data.result.status_url;
          // You would typically redirect the user to this URL
          console.log("Redirect user to:", checkoutUrl);

          // For simplicity, we'll assume the payment is successful immediately
          transaction.status = "success";
          await transaction.save();

          // Update user wallet with the top-up amount
          const userWallet = await WalletModel.findOne({ userId });

          if (!userWallet) {
            // Create a new wallet if it doesn't exist
            const newWallet = new WalletModel({
              userId,
            });
            await newWallet.save();
          }

          const updatedWallet = await WalletModel.findOneAndUpdate(
            { userId },
            { $inc: { mainWallet: amount } },
            { new: true }
          );

          if (!updatedWallet) {
            throw new Error("Failed to update user wallet");
          }

          return transaction;
        } else {
          // Handle CoinPayments API error
          throw new Error("CoinPayments API error: " + coinPaymentsResponse.data.error);
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to top up wallet");
      }
    },
  },
};

module.exports = resolvers;
