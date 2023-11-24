const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongooseURL = process.env.MONGOOSE_URL;

const connectDB = async () => {
  const dbName = "GFC";
  try {
    await mongoose.connect(mongooseURL, {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
          // Use the drop method on the Mongoose model
      // user.collection.drop()
      //   .then(() => {
      //     console.log("collection dropped successfully.");
      //   })
      
    })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectDB;