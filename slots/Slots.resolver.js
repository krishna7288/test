const slot = require("./Slots.model");
const wallet = require("../wallets/Wallet.model");
const adminWallet = require('../adminWallet/AdminWallet.model');
const user = require('../user/user.model');

const slots_resolver = {
  Query: {
    getAllSlot: async () => {
      try {
        const allSlots = await slot.find();
        return allSlots;
      } catch (error) {
        throw new Error(`Error fetching all slot: ${error.message}`);
      }
    },
    getSlotsById: async (_, { id }) => {
      try {
        const slotById = await slot.findById({ id });
        return slotById;
      } catch (error) {
        throw new Error(`Error fetching slot by ID: ${error.message}`);
      }
    },
  },

  Mutation: {
    createSlot: async (_, args) => {
      try {
        const { slotPlan_id, slot_plan, userId, no_of_slots, total_amt, upLineId } =
          args.slot;

        const sendData = {
          slot_id: (await slot.find().count()) + 1,
          userId: userId,
          slotPlan_id: slotPlan_id,
          slot_plan: slot_plan,
          no_of_slots: no_of_slots,
          total_amt: total_amt,
          upLineId:upLineId,
          status: 1,
        };

        const checkSlotStatus = await slot.findOne({
          userId: userId,
          status: 1,
        });

        // if (!!checkSlotStatus) {
          const checkWallet = await wallet.findOne({ userId: userId });

          // console.log(checkWallet)

          const numericSlotPlan = parseFloat(slot_plan);

          const slotReserveWallet_PercentageValue = (10 / 100) * numericSlotPlan;

          console.log("slotReserveWallet_PercentageValue",slotReserveWallet_PercentageValue);


          const verifyReserveWallet = checkWallet.reserveWallet > slotReserveWallet_PercentageValue.toFixed(4);;

          console.log("verifyReserveWallet",verifyReserveWallet);

          const balanceSlotValue = numericSlotPlan - slotReserveWallet_PercentageValue.toFixed(4);;

          console.log("balanceSlotValue",balanceSlotValue)

          const verifyMainWallet = checkWallet.mainWallet > balanceSlotValue;

          console.log("checkMainWallet",verifyMainWallet);

          if(verifyReserveWallet && verifyMainWallet){
            const updateWallet = await wallet.updateOne(
              { userId: userId }, 
              {
                $inc: {
                  mainWallet: -balanceSlotValue,
                  reserveWallet: -slotReserveWallet_PercentageValue, 
                },
              }
            );
            
            console.log("updateWallet",updateWallet)

            const slotValue = balanceSlotValue + slotReserveWallet_PercentageValue

            console.log("slotValue", slotValue)
  
            const SlotFeeDeduction = (1 / 100) * slotValue;
  
            console.log("SlotFeeDeduction",SlotFeeDeduction)

            const decimalSlotFeeDeduction = SlotFeeDeduction.toFixed(4)
  
            const sendAdminJoiningFee = await adminWallet.updateOne(
              { admin_id: "akash001" }, 
              {
                $inc: {
                 admin_commision: +decimalSlotFeeDeduction
                },
            }
            )
  
            console.log("sendAdminJoiningFee", sendAdminJoiningFee)
  
            const balanceSlotValue_2 = slotValue - SlotFeeDeduction
  
            console.log("balanceSlotValue_2", balanceSlotValue_2)

            const firstReferralPercentageValue = (5 / 100) * balanceSlotValue_2;

            const regularReferralPercentageValue = (1 / 100) * balanceSlotValue_2;

            console.log("eufewu",firstReferralPercentageValue.toFixed(4), regularReferralPercentageValue.toFixed(4))
  
            const checkFirst_ReferralPercentage = await user.findOne({
              userId: userId
            })
  
            console.log("checkFirst_ReferralPercentage",checkFirst_ReferralPercentage)

            if(checkFirst_ReferralPercentage.firstReferralPercentage){

              const findFirstReferralUser = await wallet.findOne({ userId: upLineId})

              console.log("findFirstReferralUser", findFirstReferralUser)

              if(!!findFirstReferralUser){

              const decimalfirstReferralPercentageValue = firstReferralPercentageValue.toFixed(4)
                
              const updatedReferralFee_To_ReferralUser = await wallet.updateOne(
                { userId: upLineId }, 
                {
                  $inc: {
                    mainWallet: +decimalfirstReferralPercentageValue,
                  },
                })

                if(updatedReferralFee_To_ReferralUser.acknowledged){
                  const updateFirstReferralPercentage_to_regularPercentage = await user.updateOne( 
                    {userId: userId}, 
                    { 
                      $set:{
                    firstReferralPercentage: false
                  }
                })

                console.log("updateFirstReferralPercentage_to_regularPercentage", updateFirstReferralPercentage_to_regularPercentage)
                }

                const firstReferral_balanceSlotValue_3 = balanceSlotValue_2 - decimalfirstReferralPercentageValue

                const roundedFirstReferralPercentageValue = Math.round(firstReferral_balanceSlotValue_3);

                const sendDecimalFirstReferralPercentageValue = firstReferral_balanceSlotValue_3 - roundedFirstReferralPercentageValue

                console.log("roundedFirstReferralPercentageValue", roundedFirstReferralPercentageValue)

                console.log("sendDecimalFirstReferralPercentageValue", sendDecimalFirstReferralPercentageValue)


                const sendRoundedFirstReferralValue = await adminWallet.updateOne(
                  { admin_id: "akash001" }, 
                  {
                    $inc: {
                     admin_wallet_balance: +sendDecimalFirstReferralPercentageValue.toFixed(4)
                    },
                }
                )
                console.log("sendRoundedFirstReferralValue", sendRoundedFirstReferralValue)

                const defaultConditionForSlot = await slot.find().count()

                console.log("defaultConditionForSlot",defaultConditionForSlot)

                if(defaultConditionForSlot === 0){
  
                  const findSlots = await slot.find()

                  console.log("findSlots", findSlots)
  
                  if(findSlots.length === 0){
  
                    const initial_SplitAmt_to_adminWallet = await adminWallet.updateOne( 
                      { admin_id: "akash001" }, 
                    {
                      $inc: {
                       admin_wallet_balance: +roundedFirstReferralPercentageValue.toFixed(4)
                      },
                  })
                  console.log(initial_SplitAmt_to_adminWallet)
                  }

                   const newSlot = new slot(sendData);
                   await newSlot.save();

                   const sendResponse = {
                    error: false,
                    status: 200,
                    message: "Slot created successfully",
                  };
          
                  return {
                    slot: sendData,
                    response: sendResponse,
                  };

                }else{
                  const findSlots = await slot.find()

                  console.log(findSlots)
                  if(findSlots.length >= 1){

                    console.log("trigger")

                  const eligibleSlots = findSlots.filter(slot => slot.slot_id < defaultConditionForSlot);
                  const numberOfSlots = eligibleSlots.length;
                  const amountPerSlot = roundedFirstReferralPercentageValue / numberOfSlots;

                  console.log("amountPerSlot", amountPerSlot)

                  console.log("eligibleSlots", eligibleSlots)

                  for (const slot of eligibleSlots) {
                    const userToUpdateId = slot.userId; // Adjust property name based on your actual data
                    const slotAmount = amountPerSlot.toFixed(4);
                
                    console.log(slotAmount);

                    console.log(userToUpdateId)
                
                    try {
                      const splitAmtToReferralUser = await wallet.updateOne(
                        { userId: userToUpdateId },
                        {
                          $inc: {
                            mainWallet: +slotAmount,
                          },
                        }
                      );
                
                      console.log(splitAmtToReferralUser);
                    } catch (error) {
                      console.error("Error updating wallet:", error);
                    }
                  }

                //   eligibleSlots.forEach(slot => {
                //     const userId = slot.userId; 
                //     const slotAmount = amountPerSlot.toFixed(4);

                //     console.log(slotAmount)

                //     const SplitAmt_to_ReferralUser = await wallet.updateOne(
                //       {
                //       userId: userId
                //     },{
                //       $inc:{
                //         mainWallet:+slotAmount
                //       }
                //     }
                //     )

                //     console.log(SplitAmt_to_ReferralUser)
                // });

                const newSlot = new slot(sendData);
                   await newSlot.save();

                   const sendResponse = {
                    error: false,
                    status: 200,
                    message: "Slot created successfully",
                  };
          
                  return {
                    slot: sendData,
                    response: sendResponse,
                  };
                  }

                }
              }

            

            }else{

              const decimalRegularReferralPercentageValue = regularReferralPercentageValue.toFixed(4)
         
              const updatedReferralFee_To_ReferralUser = await wallet.updateOne(
                { userId: upLineId }, 
                {
                  $inc: {
                    mainWallet: +decimalRegularReferralPercentageValue,
                  },
                })

                console.log("updatedReferralFee_To_ReferralUser", updatedReferralFee_To_ReferralUser)

                const RegularReferral_balanceSlotValue_3 = balanceSlotValue_2 - decimalRegularReferralPercentageValue

                
                const roundedRegularReferralPercentageValue = Math.round(RegularReferral_balanceSlotValue_3);

                const sendDecimalRegularReferralPercentageValue = RegularReferral_balanceSlotValue_3 - roundedRegularReferralPercentageValue

                console.log("roundedRegularReferralPercentageValue", roundedRegularReferralPercentageValue)

                console.log("sendDecimalRegularReferralPercentageValue", sendDecimalRegularReferralPercentageValue)

                const sendRoundedRegularReferralValue = await adminWallet.updateOne(
                  { admin_id: "akash001" }, 
                  {
                    $inc: {
                     admin_wallet_balance: +sendDecimalRegularReferralPercentageValue.toFixed(4)
                    },
                }
                )
                console.log("sendRoundedRegularReferralValue", sendRoundedRegularReferralValue)

            }

            // const firstReferralBalanceSlotValue = balanceSlotValue_2 - firstReferralPercentageValue;
            // const regularReferralBalanceSlotValue = balanceSlotValue_2 - regularReferralPercentageValue;

            // console.log("balance",firstReferralBalanceSlotValue, regularReferralBalanceSlotValue)

          }else if (verifyReserveWallet === false){
            console.log("Insufficient reserve wallet balance", verifyReserveWallet)
          }else if(verifyMainWallet === false){
            console.log("Insufficient Main wallet balance", verifyMainWallet)
          }

          const deductedSlot = no_of_slots - 1;

        // } else {
          
        // }

      } catch (error) {
        throw new Error(`Error creating slot: ${error.message}`);
      }
    },

    updateSlot: async (
      _,
      { slots: { slotplan_id, plan, status, updated_at } }
    ) => {
      try {
        const updateSlots = await slot.updateOne(
          { slotplan_id: slotplan_id },
          {
            $set: {
              plan: plan,
              status: status,
              updated_at: updated_at,
            },
          }
        );

        if (updateSlots.nModified === 0) {
          throw new Error(`Slot with ID ${id} not found`);
        }

        const sendResponse = {
          error: false,
          status: 200,
          message: "Slot updated successfully",
        };

        return {
          user: updateSlots,
          response: sendResponse,
        };
      } catch (error) {
        throw new Error(`Error updating slot: ${error.message}`);
      }
    },
  },
};

module.exports = slots_resolver;
