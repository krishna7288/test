const signup = require("../signup/signup.model");
const user = require("./user.model");
const nodemailer = require("nodemailer"); // Import Nodemailer
const jwt = require("jsonwebtoken");
const wallet = require("../wallets/Wallet.model");
//const { GraphQLUpload } = require('graphql-upload')
//import GraphQLUpload from "./GraphQLUpload.mjs";

const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., "Gmail", "Outlook", "Yahoo", etc.
  Host: "smtp.gmail.com",
  Port: 465, //(with SSL) or 587 (with TLS)
  Secure: true, //(for SSL) or false (for TLS)
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASSWORD,
  },
});

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  return otp.padStart(4, "0"); // Ensure the OTP is always 4 digits by padding with leading zeros
};

const generateUserId = () => {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const idLength = 8; // You can adjust the length as needed
  let userId = "";

  for (let i = 0; i < idLength; i++) {
    if (i % 2 === 0) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      userId += numbers[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * letters.length);
      userId += letters[randomIndex];
    }
  }

  return userId;
};

const user_resolvers = {
  //Upload: GraphQLUpload,

  Query: {
    getAllUsers: async () => {
      return await user.find();
    },
    myReferral: async (_, { userId }) => {
      return await user.find({ upLineId: userId });
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      try {
        const { upLineId, name, otp, emailId } = args.user;

        // console.log(args.user);

        const addedUserId = generateUserId();

        const NumericOtp = parseInt(otp, 10);

        const otpVerify = await signup.find({ emailId: emailId });

        if (otpVerify.length >= 1) {
          if (otpVerify[0].otp === NumericOtp) {
            const nextUserId = `GAA${addedUserId.toString().padStart(3, "0")}`;

            // console.log("user id :", nextUserId);

            const userDetail = {
              userId: nextUserId,
              name: name,
              emailId: emailId,
              upLineId: upLineId,
            };

            const data = new user(userDetail);
            await data.save();

            const checkData = !!data;

            if (checkData) {
              const walletData = new wallet({ userId: data.userId });
              await walletData.save();
            }

            const sendResponse = {
              error: false,
              status: 200,
              message: "User created successfully",
            };

            return {
              user: data,
              response: sendResponse,
            };
          }
        }

        const sendResponse = {
          error: true,
          status: 400,
          message: "OTP is not Valid",
        };

        return {
          response: sendResponse,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    UserReferralVerify: async (parent, args) => {
      try {
        const { upLineId } = args.referralVerify;

        const referralVerify = await user.findOne({ userId: upLineId });

        console.log("ref", referralVerify);

        if (referralVerify !== null) {
          const sendDetails = {
            userId: referralVerify.userId,
            name: referralVerify.name,
            emailId: referralVerify.emailId,
          };

          const sendResponse = {
            error: false,
            status: 200,
            message: "Referral Id verified",
          };

          return {
            referralUser: sendDetails,
            response: sendResponse,
          };
        } else if (referralVerify === null) {
          const sendResponse = {
            error: false,
            status: 200,
            message: "Referral Id is Invalid",
          };

          return {
            response: sendResponse,
          };
        }
      } catch (err) {
        throw new Error(err.message);
      }
    },

    createOtpForUser: async (parent, args, context) => {
      const { emailId, name, upLineId } = args.otpForUser;

      const checkEmailExists = async (emailId) => {
        const getEmailExists = await signup.findOne({ emailId: emailId });
        return !!getEmailExists;
      };

      const emailExists = await checkEmailExists(emailId);
      try {
        const otp = generateOTP();

        const mailOptions = {
          from: "noreply@gfc.com", // Sender's emailId address
          to: emailId, // Recipient's email address
          subject: "Your OTP for registration",
          html: `<!DOCTYPE html>
    <html>
    
    <head>
        <title>One-Time Password (OTP) Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #ffffff;
            }
    
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            .otp-section {
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
            }
    
            .otp-code {
                font-size: 30px;
                font-weight: bold;
                color: #007bff;
            }
    
            .instructions {
                margin-top: 20px;
            }
    
            .cta-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 30px;
            }
    
            .footer {
                text-align: center;
                margin-top: 40px;
                color: #777;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <h2>One-Time Password (OTP) Email</h2>
            </div>
            <div class="otp-section">
                <p>Hello ${name},</p>
                <p>Your one-time password (OTP) for verification of reset the password is:</p>
                <div class="otp-code">${otp}</div>
                <p class="instructions">This OTP is valid for a limited time and can only be used once.</p>
            </div>
            <p>If you did not request this OTP, please ignore this email. Please do not share this OTP with anyone.</p>
            <div class="footer">
                <p>This email was sent automatically. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    
    </html>
    `,
        };

        // Promisify the sendMail function

        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            reject("Error sending email");
          } else {
            const OTPDetails = {
              name: name,
              emailId: emailId,
              upLineId: upLineId,
              otp: otp,
              otpCreatedAt: new Date(),
            };

            if (emailExists) {
              await signup.updateOne(
                { emailId: emailId },
                { $set: { otp: otp } }
              );
            } else {
              const data = new signup(OTPDetails);
              await data.save();
            }
          }
        });

        const sendResponse = {
          error: false,
          status: 200,
          message: "otp sent successfully",
        };

        return {
          response: sendResponse,
        };
      } catch (err) {
        console.error("Error in createOtpForUser:", err);
        throw new Error(err.message);
      }
    },

    loginMailVerifyAndSendOtp: async (parent, args, context) => {
      const { emailId } = args.verifymail;

      const checkEmailExists = async (emailId) => {
        const getEmailExists = await signup.findOne({ emailId: emailId });
        return !!getEmailExists;
      };

      const emailExists = await checkEmailExists(emailId);

      const otp = generateOTP();

      console.log(otp);

      if (emailExists) {
        const mailOptions = {
          from: "noreply@gfc.com", // Sender's email address
          to: emailId, // Recipient's email address
          subject: "Your OTP for registration",
          html: `<!DOCTYPE html>
    <html>
    
    <head>
        <title>One-Time Password (OTP) Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #ffffff;
            }
    
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            .otp-section {
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
            }
    
            .otp-code {
                font-size: 30px;
                font-weight: bold;
                color: #007bff;
            }
    
            .instructions {
                margin-top: 20px;
            }
    
            .cta-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 30px;
            }
    
            .footer {
                text-align: center;
                margin-top: 40px;
                color: #777;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <h2>One-Time Password (OTP) Email</h2>
            </div>
            <div class="otp-section">
                <p>Hello ${emailExists.name},</p>
                <p>Your one-time password (OTP) for verification of reset the password is:</p>
                <div class="otp-code">${otp}</div>
                <p class="instructions">This OTP is valid for a limited time and can only be used once.</p>
            </div>
            <p>If you did not request this OTP, please ignore this email. Please do not share this OTP with anyone.</p>
            <div class="footer">
                <p>This email was sent automatically. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    
    </html>
    `,
        };

        // Promisify the sendMail function

        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            if (emailExists) {
              await signup.updateOne(
                { emailId: emailId },
                { $set: { otp: otp } }
              );
            } else {
              console.log("Email ID is not exist", emailExists);
            }
          }
        });

        const sendResponse = {
          error: false,
          status: 200,
          message: "otp sent successfully",
        };

        return {
          response: sendResponse,
        };
      } else {
        const sendResponse = {
          error: true,
          status: 400,
          message: "Email ID is not exist",
        };

        return {
          response: sendResponse,
        };
      }
    },

    loginAuthVerify: async (parent, args) => {
      const { emailId, otp } = args.verifyOtp;

      try {
        const response = await user.find({ emailId: emailId });

        console.log("hh", response);

        if (Array.isArray(response) && response.length === 0) {
          // Code block to handle the case when data is an empty array

          return {
            response: {
              error: true,
              status: 400,
              message: "invalid Email ID!",
            },
          };
        }

        const generateAccessToken = () => {
          return jwt.sign({ id: response[0]._id }, "gfcaccessjwtsecret", {
            expiresIn: "20m",
          });
        };

        const generateRefreshToken = () => {
          return jwt.sign({ id: response[0]._id }, "gfcrefreshjwtsecret", {
            expiresIn: "1d",
          });
        };

        const check_OTP = await signup.findOne({ emailId: emailId });

        if (emailId === response[0].emailId && otp === check_OTP.otp) {
          const accessToken = generateAccessToken();

          return {
            user: {
              id: response[0]._id,
              name: response[0].name,
              emailId: response[0].emailId,
              userId: response[0].userId,
              upLineId: response[0].upLineId,
              accessToken: accessToken,
            },
            response: {
              error: false,
              status: 200,
              message: "Logged in successfully",
            },
          };
        } else {
          return {
            error: true,
            status: 400,
            message: "Invalid Email ID",
          };
        }
      } catch (err) {
        console.error("Error in createOtpForUser:", err);
        throw new Error(err.message);
      }
    },

    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      console.log("test", createReadStream, filename, mimetype, encoding);
    },

    updateUser: async (parent, args) => {
      const { userId, upLineId, name, emailId, profilePicture } = args.user;
      try {
        const updatedUser = await user.updateOne(
          { _id: userId },
          {
            $set: {
              upLineId: upLineId,
              name: name,
              emailId: emailId,
            },
          }
        );

        if (updatedUser.nModified === 0) {
          throw new Error(`User with ID ${userId} not found`);
        }

        const sendResponse = {
          error: false,
          status: 200,
          message: "User updated successfully",
        };

        return {
          user: updatedUser,
          response: sendResponse,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = user_resolvers;
