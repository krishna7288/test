const express = require("express");
const app = express();
const connectDB = require("./common/dbconnect");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const typedefs_index = require("./typedefs_index");
const resolvers_index = require("./resolvers_index");



connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT || 6000;

const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs: typedefs_index,
    resolvers: resolvers_index,
    context: async ({ req }) => {
      // const checkEmailExists = async (emailId) => {
      //   const emailExists = await signup.findOne({ emailId: emailId });
      //   return !!emailExists;
      // };

      // const updateOtp = async (emailId, otp) => {
      //   try {
      //     console.log("up", emailId, otp);

      //     const result = await signup.updateOne(
      //       { emailId: emailId },
      //       { $set: { otp: otp } }
      //     );

      //     if (result) {
      //       console.log("OTP updated successfully.");
      //     } else {
      //       console.log("No matching document found for update.");
      //     }
      //   } catch (error) {
      //     console.error("Error updating OTP:", error);
      //     throw error; // You can handle the error in your resolver or middleware
      //   }
      // };

      // const checkEmailExistInUser = async (emailId) => {
      //   const emailExists = await user.findOne({ emailId: emailId });
      //   return !!emailExists;
      // };

      return {
        // Other context properties...
        // checkEmailExists,
        // updateOtp,
        // checkEmailExistInUser,
      };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app, path: "/gfcql" });

  app.use((req, res, next) => {
    res.send(
      "<h1>404 Page not found check the URL you have entered correctly</h1>"
    );
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();


