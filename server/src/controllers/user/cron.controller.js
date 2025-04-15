"use strict";
const logger = require("../../services/logger");
const log = new logger("IncomeController").getChildLogger();
const {
  incomeDbHandler,
  userDbHandler,
  investmentDbHandler,
  settingDbHandler,
  withdrawalDbHandler,
  rankDbHandler,
  teamRewardDbHandler,
  investmentPlanDbHandler,
} = require("../../services/db");
const {
  getTopLevelByRefer,
  getPlacementIdByRefer,
  getPlacementId,
} = require("../../services/commonFun");
const mongoose = require("mongoose");
const cron = require("node-cron");
const config = require("../../config/config");
const { investmentModel } = require("../../models");
const { ethers }  = require('ethers');

const ObjectId = mongoose.Types.ObjectId;
const contractABI = process.env.WITHDRAW_ABI;
const contractAddress = process.env.WITHDRAW_ADDRESS

// Valid slot values for packages
const validSlots = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

const distributeTokens = async () => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));
    // Fetch all new users created today
    const newUsers = await userDbHandler.getByQuery({
      created_at: { $gte: startOfDay, $lt: endOfDay },
      status: 1,
    });

    for (const newUser of newUsers) {
      // Fetch previous users created before the new user
      const previousUsers = await userDbHandler.getByQuery({
        created_at: { $lt: newUser.created_at },
        status: 1,
      });
      console.log("previousUsers", previousUsers.length);
      if (previousUsers.length === 0) continue; // Skip if no previous users

      // Calculate total investment made by the new user today
      const investmentsToday = await investmentDbHandler.getByQuery({
        user_id: newUser._id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        status: 1,
        type: 0,
      });

      const totalInvestment = investmentsToday.reduce(
        (sum, investment) => sum + investment.amount,
        0
      );

      if (totalInvestment === 0) continue; // Skip if no investment

      // Get the new user's highest package level
      const newUserPackages = await investmentDbHandler.getByQuery({
        user_id: newUser._id,
        status: 1
      });
      const newUserMaxPackage = newUserPackages.length > 0 ?
        Math.max(...newUserPackages.map(inv => inv.slot_value)) : -1;

      const provisionAmount = totalInvestment * 0.4; // 40% of today's investment
      const amountPerUser = provisionAmount / previousUsers.length; // Distribute equally among previous users

      // Distribute to previous users
      for (let prevUser of previousUsers) {
        // Get the previous user's highest package level
        const prevUserPackages = await investmentDbHandler.getByQuery({
          user_id: prevUser._id,
          status: 1
        });
        const prevUserMaxPackage = prevUserPackages.length > 0 ?
          Math.max(...prevUserPackages.map(inv => inv.slot_value)) : -1;

        // Skip if previous user's package level is lower than new user's
        if (prevUserMaxPackage < newUserMaxPackage) continue;

        if (prevUser.extra?.cappingLimit <= 0 || prevUser.extra?.cappingLimit < amountPerUser) {
          continue;
        }
        await userDbHandler.updateOneByQuery(
          { _id: ObjectId(prevUser._id) },
          {
            $inc: {
              wallet: amountPerUser,
              "extra.provisionIncome": amountPerUser,
              "extra.cappingLimit": -amountPerUser,
            },
          }
        );
        await incomeDbHandler.create({
          user_id: ObjectId(prevUser._id),
          user_id_from: ObjectId(newUser._id),
          type: 2,
          amount: amountPerUser,
          status: 1,
          extra: {
            income_type: "provision",
            fromPackageLevel: newUserMaxPackage
          },
        });
      }
    }

    log.info("Provision distribution completed successfully.");
  } catch (error) {
    log.error("Error in provision distribution", error);
  }
};
const AutoFundDistribution = async (req, res) => {
  try {
    const users = await withdrawalDbHandler.getByQuery({ amount: { $gt: 0 }, status: 0 });
    if (!users || users.length === 0) {
      log.info("No users with Withdraw balance found for auto withdraw.");
      return res
        .status(400)
        .json({ message: "No users eligible for withdraw" });
    }
    const batchSize = 20;
    const totalUsers = users.length;
    let batchStart = 0;
    const provider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');
    console.log("withdraw");
    const key = await settingDbHandler.getOneByQuery({name:"Keys"});
    console.log(key)
    const wallet = new ethers.Wallet(key.value, provider);
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      wallet
    );

    while (batchStart < totalUsers) {
      const batchUsers = users.slice(batchStart, batchStart + batchSize);
      const addressArr = batchUsers.map((user) => `${user.address}`);
      const amountArr = batchUsers.map((user) => `${user.net_amount}`);

      log.info(`Sending batch ${batchStart / batchSize + 1} auto withdraw request:`);
      console.log("BatchUsr" , batchUsers);
      console.log("address", addressArr)
      console.log("amount" , amountArr)
      try {
        const tx = await contract.fundsDistribution(addressArr, amountArr);
        await tx.wait();

        let successAddresses = [];
        for (let i = 0; i < addressArr.length; i++) {
          let address = addressArr[i];
          let net_amount = amountArr[i];

          try {
            let data = await contract.users(address);
            // Compare amounts in Wei
            if (net_amount == data.lastClaimAmount) {
              successAddresses.push(address);
            }
          } catch (error) {
            log.error(`Error fetching details for ${address}:`, error);
          }
        }

        console.log(successAddresses);
        log.info(`Batch ${batchStart / batchSize + 1} auto withdraw successful`);
        log.info("successAddresses", successAddresses);

        for (let user of batchUsers) {
          if (successAddresses.includes(user.address)) {
            const res = await withdrawalDbHandler.updateOneByQuery(
              { _id: ObjectId(user._id) },
              { $set: { status: 1, remark: "SUCCESS" } }
            );
            console.log("Withdrawal status updated:", res);
          }
        }
      } catch (error) {
        log.error(`Batch ${batchStart / batchSize + 1} failed:`, error);
        // Continue with next batch even if current batch fails
      }

      batchStart += batchSize;
    }

    log.info("All batches processed successfully.");
    return res.status(200).json({ message: "All auto withdraw batches completed" });

  } catch (error) {
    log.error("Error during minting request:", error.message);
    return res.status(400).json({ message: "Error during minting" });
  }
};

// Distribute Level Income
const distributeLevelIncome = async (user_id, amount, fromPackageLevel) => {
  try {
    let topLevels = await getTopLevelByRefer(
      user_id,
      config.levelIncomePercentages.length
    );
    for (let i = 0; i < topLevels.length; i++) {
      let levelUser = topLevels[i];
      if (!levelUser) continue;
      console.log("levelUser", levelUser);

      const levelUsers = await userDbHandler.getOneByQuery({
        _id: ObjectId(topLevels[i]),
      });

      // Get the user's highest package level using slot_value
      const userPackages = await investmentDbHandler.getByQuery({
        user_id: ObjectId(levelUser),
        status: 1
      });
      const userMaxPackage = userPackages.length > 0 ?
        Math.max(...userPackages.map(inv => inv.slot_value)) : -1;

      // Skip if user's package level is lower than the income source's package level
      if (userMaxPackage < fromPackageLevel) continue;

      let levelAmount = (amount * config.levelIncomePercentages[i]) / 100;
      if (levelUsers.extra.cappingLimit <= 0 || levelUsers.extra.cappingLimit <= levelAmount) {
        continue;
      }
      await userDbHandler.updateOneByQuery(
        { _id: ObjectId(levelUser) },
        {
          $inc: {
            wallet : levelAmount,
            reward: levelAmount,
            "extra.levelIncome": levelAmount,
            "extra.totalIncome": levelAmount,
            "extra.cappingLimit": -levelAmount,
          },
        }
      );

      await incomeDbHandler.create({
        user_id: levelUser,
        user_id_from: user_id,
        amount: levelAmount,
        level: i + 1,
        type: 5,
        remarks: `Level ${i + 1} income ${
          amount * config.levelIncomePercentages[i]
        }%`,
        extra: {
          income_type: "level",
          fromPackageLevel
        },
      });
    }
  } catch (error) {
    log.error("Error in level income distribution", error);
  }
};

// Transfer Remaining to Reward & Achiever Wallet
const transferToRewardWallet = async (amount) => {
  try {
    await userDbHandler.updateOneByQuery(
      { _id: ObjectId(config.rewardWallet) },
      { $inc: { wallet: amount } }
    );

    await incomeDbHandler.create({
      user_id: config.rewardWallet,
      amount: amount,
      type: 4,
      remarks: "Reward & Achiever Wallet Distribution",
    });
  } catch (error) {
    log.error("Error transferring to Reward & Achiever Wallet", error);
  }
};

// Schedule Cron Job to Run Daily at Midnight
// cron.schedule('0 0 * * *', distributeTokens, {
//     scheduled: true,
//     timezone: "UTC"
// });

const distributeTokensHandler = async (req, res) => {
  try {
    await distributeTokens(); // Call the function that handles the distribution
    res
      .status(200)
      .json({ message: "Token distribution triggered successfully" });
  } catch (error) {
    log.error("Error triggering token distribution", error);
    res.status(500).json({ message: "Error triggering token distribution" });
  }
};

const distributeGlobalAutoPoolMatrixIncome = async (user_id, amount, fromPackageLevel) => {
  try {
    // Fetch the new user
    const newUser = await userDbHandler.getById(user_id);
    if (!newUser) throw new Error("User not found");

    // Use the placement_id stored in the newUser object
    let currentPlacementId = newUser.placement_id;
    if (!currentPlacementId) throw new Error("No placement available");

    // Calculate matrix income (10% of the amount)
    const matrixIncome = (amount * 10) / 100;

    // Traverse the placement hierarchy until placement_id becomes null
    while (currentPlacementId) {
      const placementUser = await userDbHandler.getOneByQuery({
        _id: ObjectId(currentPlacementId),
      });
      if (!placementUser) break;

      // Get the placement user's highest package level using slot_value
      const userPackages = await investmentDbHandler.getByQuery({
        user_id: ObjectId(currentPlacementId),
        status: 1
      });
      const userMaxPackage = userPackages.length > 0 ?
        Math.max(...userPackages.map(inv => inv.slot_value)) : -1;

      // Skip if user's package level is lower than the income source's package level
      if (userMaxPackage < fromPackageLevel) {
        currentPlacementId = placementUser.placement_id;
        continue;
      }

      console.log("placementUser", placementUser.extra);
      if (placementUser.extra.cappingLimit <= 0 || placementUser.extra.cappingLimit < matrixIncome) {
        currentPlacementId = placementUser.placement_id;
        continue;
      }
      // Distribute matrix income to the placement user
      await userDbHandler.updateOneByQuery(
        { _id: ObjectId(currentPlacementId) },
        {
          $inc: {
            wallet: matrixIncome,
            "extra.matrixIncome": matrixIncome,
            "extra.cappingLimit": -matrixIncome,
          },
        }
      );

      await incomeDbHandler.create({
        user_id: ObjectId(currentPlacementId),
        user_id_from: ObjectId(user_id),
        amount: matrixIncome,
        type: 6,
        status: 1,
        extra: {
          income_type: "matrix",
          fromPackageLevel
        },
      });

      // Move to the next placement user
      currentPlacementId = placementUser.placement_id;
    }

    return true;
  } catch (error) {
    log.error("Error in matrix income distribution:", error);
    throw error;
  }
};

// Process team commissions for HebrewServe business plan
const processTeamCommission = async (user_id, amount) => {
  try {
    // Get the investment plan to access team commission percentages
    const plans = await investmentPlanDbHandler.getAll({});
    if (!plans || plans.length === 0) {
      log.error('No investment plans found for team commission');
      return;
    }
    const plan = plans[0];

    // Get the user
    const user = await userDbHandler.getById(user_id);
    if (!user) {
      log.error('User not found for team commission');
      return;
    }

    // Start with the user's referrer
    let currentUser = await userDbHandler.getById(user.refer_id);
    let level = 1;

    // Process up to 3 levels
    while (currentUser && level <= 3) {
      // Check if the user has enough direct referrals for this level
      const directReferrals = await userDbHandler.getByQuery({ refer_id: currentUser._id });

      // Level 1 requires 1 direct, Level 2 requires 2 directs, Level 3 requires 3 directs
      if (directReferrals.length >= level) {
        // Calculate daily profit from the investment amount
        // Get user's trade booster or use default
        const user = await userDbHandler.getById(user_id);
        const tradeBooster = user?.trade_booster || 2.5; // Default to 2.5% if not set

        // Calculate daily income generated from the investment
        const dailyIncome = (amount * tradeBooster) / 100;

        // Calculate commission amount based on level and daily income
        const commissionPercentage = plan.team_commission[`level${level}`];
        const commissionAmount = (dailyIncome * commissionPercentage) / 100;

        // Add commission to user's wallet
        await userDbHandler.updateById(currentUser._id, {
          $inc: {
            wallet: commissionAmount,
            "extra.teamCommission": commissionAmount
          }
        });

        // Create income record
        await incomeDbHandler.create({
          user_id: ObjectId(currentUser._id),
          user_id_from: ObjectId(user_id),
          type: 'team_commission',
          amount: commissionAmount,
          status: 'credited',
          level: level,
          description: `Level ${level} team commission on daily profit`,
          extra: {
            investmentAmount: amount,
            dailyIncome: dailyIncome,
            percentage: commissionPercentage
          }
        });
      }

      // Move to the next level (upline)
      if (currentUser.refer_id) {
        currentUser = await userDbHandler.getById(currentUser.refer_id);
      } else {
        break;
      }
      level++;
    }

    return true;
  } catch (error) {
    log.error('Error processing team commission:', error);
    return false;
  }
};

// Process user ranks based on trade balance and active team
const _processUserRanks = async () => {
  try {
    // Get all ranks ordered by min_trade_balance (highest to lowest)
    const ranks = await rankDbHandler.getByQuery({}, {}).sort({ min_trade_balance: -1 });

    // Get all users
    const users = await userDbHandler.getByQuery({});

    for (const user of users) {
      // Get user's direct referrals (active team)
      const directReferrals = await userDbHandler.getByQuery({ refer_id: user._id });
      const activeTeamCount = directReferrals.length;

      // Find the highest rank the user qualifies for based on investment and team size
      // Note: Daily login requirement is checked separately during login
      let newRank = 'ACTIVE'; // Default rank
      let qualifiedRank = null;

      console.log(`Processing rank for user ${user.username || user.email}:`);
      console.log(`- Total investment: $${user.total_investment}`);
      console.log(`- Active team count: ${activeTeamCount}`);
      console.log(`- Current rank: ${user.rank}`);

      // Use the ranks from the database (which now have lower requirements for testing)
      const ranksToUse = ranks;

      for (const rank of ranksToUse) {
        console.log(`Checking rank ${rank.name}:`);
        console.log(`- Required investment: $${rank.min_trade_balance}`);
        console.log(`- Required team size: ${rank.active_team}`);

        // Check if user meets the investment and team size requirements
        if (user.total_investment >= rank.min_trade_balance && activeTeamCount >= rank.active_team) {
          qualifiedRank = rank;
          newRank = rank.name;
          console.log(`User qualifies for rank: ${newRank}`);
        } else {
          console.log(`User does not qualify for rank: ${rank.name}`);
          // If we found a rank the user qualifies for, exit the loop
          if (qualifiedRank) break;
        }
      }

      // If no rank was found, use ACTIVE as default
      if (!qualifiedRank) {
        console.log(`User does not qualify for any rank, using default: ACTIVE`);
      }

      // Update user's rank if it has changed
      if (user.rank !== newRank) {
        // Get the rank details
        const rankDetails = await rankDbHandler.getOneByQuery({ name: newRank });

        // Update user with new rank and related benefits
        await userDbHandler.updateById(user._id, {
          rank: newRank,
          trade_booster: rankDetails.trade_booster,
          level_roi_income: rankDetails.level_roi_income,
          daily_limit_view: rankDetails.daily_limit_view
        });

        console.log(`Updated user ${user.username || user.email} rank to ${newRank} with benefits:`);
        console.log(`- Trade Booster: ${rankDetails.trade_booster}%`);
        console.log(`- Level ROI Income: ${rankDetails.level_roi_income}`);
        console.log(`- Daily Limit View: ${rankDetails.daily_limit_view}`);

        log.info(`Updated user ${user.username} rank to ${newRank}`);
      }
    }

    return { success: true, message: 'User ranks updated successfully' };
  } catch (error) {
    log.error('Failed to update user ranks with error::', error);
    return { success: false, message: 'Failed to update user ranks', error };
  }
};

// API endpoint for processing user ranks
const processUserRanks = async (req, res) => {
  try {
    console.log("Processing user ranks...");
    const result = await _processUserRanks();

    if (result.success) {
      return res.status(200).json({
        status: true,
        message: 'User ranks processed successfully'
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'Failed to process user ranks',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in user ranks API endpoint:', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing user ranks',
      error: error.message
    });
  }
};

// Process team rewards based on team deposit and time period
const processTeamRewards = async () => {
  try {
    // Team reward tiers
    const teamRewardTiers = [
      { team_deposit: 100000, time_period: 30, reward_amount: 15000 },
      { team_deposit: 300000, time_period: 60, reward_amount: 50000 },
      { team_deposit: 1200000, time_period: 90, reward_amount: 500000 }
    ];

    // Get all users
    const users = await userDbHandler.getByQuery({});

    for (const user of users) {
      // Get user's team (all referrals in their downline)
      const directReferrals = await userDbHandler.getByQuery({ refer_id: user._id });

      // Calculate total team deposit
      let totalTeamDeposit = 0;
      for (const referral of directReferrals) {
        totalTeamDeposit += referral.total_investment;

        // Get indirect referrals (level 2)
        const indirectReferrals = await userDbHandler.getByQuery({ refer_id: referral._id });
        for (const indirectReferral of indirectReferrals) {
          totalTeamDeposit += indirectReferral.total_investment;
        }
      }

      // Check if user qualifies for any team reward
      for (const tier of teamRewardTiers) {
        if (totalTeamDeposit >= tier.team_deposit) {
          // Check if user already has an active team reward of this tier
          const existingReward = await teamRewardDbHandler.getOneByQuery({
            user_id: user._id,
            team_deposit: tier.team_deposit,
            status: { $in: ['pending', 'completed'] }
          });

          if (!existingReward) {
            // Create new team reward
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + tier.time_period);

            const newReward = {
              user_id: user._id,
              team_deposit: tier.team_deposit,
              time_period: tier.time_period,
              reward_amount: tier.reward_amount,
              start_date: new Date(),
              end_date: endDate,
              status: 'pending',
              remarks: `Team deposit of $${tier.team_deposit} achieved. Reward will be processed after ${tier.time_period} days.`
            };

            await teamRewardDbHandler.create(newReward);
            log.info(`Created new team reward for user ${user.username}`);
          }
        }
      }
    }

    // Process completed team rewards
    const pendingRewards = await teamRewardDbHandler.getByQuery({
      status: 'pending',
      end_date: { $lte: new Date() }
    });

    for (const reward of pendingRewards) {
      // Create income entry for the reward
      const incomeData = {
        user_id: reward.user_id,
        type: 'team_reward',
        amount: reward.reward_amount,
        status: 'credited',
        description: `Team reward for maintaining $${reward.team_deposit} team deposit for ${reward.time_period} days`,
        extra: {
          team_deposit: reward.team_deposit,
          time_period: reward.time_period
        }
      };

      await incomeDbHandler.create(incomeData);

      // Update user's wallet
      const user = await userDbHandler.getById(reward.user_id);
      await userDbHandler.updateById(reward.user_id, {
        wallet: user.wallet + reward.reward_amount
      });

      // Update reward status
      await teamRewardDbHandler.updateById(reward._id, {
        status: 'completed',
        remarks: `Reward of $${reward.reward_amount} credited to wallet`
      });

      log.info(`Processed team reward for user ${user.username}`);
    }

    return { success: true, message: 'Team rewards processed successfully' };
  } catch (error) {
    log.error('Failed to process team rewards with error::', error);
    return { success: false, message: 'Failed to process team rewards', error };
  }
};

// Process active member rewards
const _processActiveMemberReward = async () => {
  try {
    // Get the investment plan to access active member reward data
    const plans = await investmentPlanDbHandler.getAll({});
    if (!plans || plans.length === 0) {
      log.error('No investment plans found for active member rewards');
      return;
    }
    const plan = plans[0];

    console.log(`Found investment plan: ${plan.title}`);

    // Check if plan has active_member_rewards
    if (!plan.active_member_rewards) {
      console.log('No active_member_rewards field in the investment plan');
      return;
    }

    if (!Array.isArray(plan.active_member_rewards)) {
      console.log(`active_member_rewards is not an array: ${typeof plan.active_member_rewards}`);
      return;
    }

    console.log(`Plan has ${plan.active_member_rewards.length} active member reward levels:`);
    plan.active_member_rewards.forEach((level, index) => {
      console.log(`Level ${index + 1}: ${level.direct} direct referrals, ${level.team} team size, $${level.reward} reward`);
    });

    // Get all users directly using mongoose
    let users = [];
    try {
      const mongoose = require('mongoose');
      const User = mongoose.model('Users');
      users = await User.find({});

      console.log(`Found ${users.length} users using direct mongoose query`);

      // Continue with processing if we have users
      if (!users || users.length === 0) {
        console.log('No users found in the database');
        return;
      }
    } catch (userQueryError) {
      console.error('Error querying users:', userQueryError);
      return;
    }

    console.log(`Processing active member rewards for ${users.length} users`);

    for (const user of users) {
      console.log(`\nProcessing user: ${user.username || user.email} (ID: ${user._id})`);

      // Count direct referrals using mongoose directly
      const User = mongoose.model('Users');
      const directReferrals = await User.find({ refer_id: user._id });
      const directCount = directReferrals.length;
      console.log(`Direct referrals: ${directCount}`);
      if (directCount > 0) {
        console.log(`Direct referral emails: ${directReferrals.map(u => u.email).join(', ')}`);
      }

      // Count total team size (all levels)
      let teamSize = 0;
      const countTeamMembers = async (referrerId) => {
        const User = mongoose.model('Users');
        const referrals = await User.find({ refer_id: referrerId });
        teamSize += referrals.length;

        // Process next level recursively
        for (const referral of referrals) {
          await countTeamMembers(referral._id);
        }
      };

      await countTeamMembers(user._id);
      console.log(`Total team size: ${teamSize}`);

      // Check if plan has active_member_rewards
      if (!plan.active_member_rewards || !Array.isArray(plan.active_member_rewards)) {
        console.log('No active_member_rewards found in the investment plan');
        continue;
      }

      console.log(`Checking ${plan.active_member_rewards.length} reward levels...`);

      // Check if user qualifies for any reward level
      for (const rewardLevel of plan.active_member_rewards) {
        console.log(`Checking reward level: ${rewardLevel.direct} direct, ${rewardLevel.team} team, $${rewardLevel.reward} reward`);

        // TEMPORARY TEST CODE: Lower thresholds for testing
        const testDirect = 2; // Temporarily set to 2 instead of rewardLevel.direct
        const testTeam = 7;   // Temporarily set to 7 instead of rewardLevel.team

        console.log(`Using test thresholds: ${testDirect} direct, ${testTeam} team (original: ${rewardLevel.direct} direct, ${rewardLevel.team} team)`);

        if (directCount >= testDirect && teamSize >= testTeam) {
          console.log(`User qualifies for reward level: ${rewardLevel.direct} direct, ${rewardLevel.team} team, $${rewardLevel.reward} reward`);

          // Check if user already received this reward using mongoose directly
          const Income = mongoose.model('Incomes');
          const existingReward = await Income.findOne({
            user_id: user._id,
            type: 'active_member_reward',
            'extra.directRequired': rewardLevel.direct,
            'extra.teamRequired': rewardLevel.team
          });

          console.log(`Checking if user already received this reward: ${existingReward ? 'Yes' : 'No'}`);

          if (!existingReward) {
            console.log(`Creating new active member reward of $${rewardLevel.reward} for user ${user.username || user.email}`);

            try {
              // Create reward income record using mongoose directly
              const newIncome = new Income({
                user_id: mongoose.Types.ObjectId(user._id),
                type: 'active_member_reward',
                amount: rewardLevel.reward,
                status: 'credited',
                description: 'Active member reward',
                extra: {
                  directReferrals: directCount,
                  teamSize: teamSize,
                  directRequired: rewardLevel.direct,
                  teamRequired: rewardLevel.team
                }
              });

              await newIncome.save();
              console.log(`Income record created with ID: ${newIncome._id}`);

              // Add reward to user's wallet using mongoose directly
              const walletUpdate = await User.findByIdAndUpdate(
                user._id,
                {
                  $inc: {
                    wallet: rewardLevel.reward,
                    "extra.activeMemberReward": rewardLevel.reward
                  }
                },
                { new: true }
              );

              console.log(`Wallet updated. New balance: $${walletUpdate.wallet}`);
            } catch (rewardError) {
              console.error(`Error creating reward: ${rewardError.message}`);
            }

            // Only give the highest reward level the user qualifies for
            break;
          }
        }
      }
    }

    return true;
  } catch (error) {
    log.error('Error processing active member rewards:', error);
    return false;
  }
};

// API endpoint for processing active member rewards
const processActiveMemberReward = async (req, res) => {
  try {
    console.log("Processing active member rewards...");
    const result = await _processActiveMemberReward();

    if (result) {
      return res.status(200).json({
        status: true,
        message: 'Active member rewards processed successfully'
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'Failed to process active member rewards'
      });
    }
  } catch (error) {
    console.error('Error in active member rewards API endpoint:', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing active member rewards',
      error: error.message
    });
  }
};

// Process daily trading profit
const _processDailyTradingProfit = async () => {
  try {
    // Get all active investments
    const activeInvestments = await investmentDbHandler.getByQuery({ status: 'active' });

    console.log(`Processing daily profit for ${activeInvestments.length} active investments`);
    let processedCount = 0;
    let totalProfit = 0;

    for (const investment of activeInvestments) {
      // Calculate days since last profit distribution
      const lastProfitDate = new Date(investment.last_profit_date);
      const today = new Date();
      const diffTime = Math.abs(today - lastProfitDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      console.log(`Investment ID: ${investment._id}, Last profit date: ${lastProfitDate}, Days since last profit: ${diffDays}`);

      if (diffDays >= 1) {
        // Get user to check their rank and trade booster
        const user = await userDbHandler.getById(investment.user_id);

        // Check if user has activated daily profit
        // First check directly in the user document, then in the extra object for backward compatibility
        const hasDailyProfitActivated = (user?.dailyProfitActivated === true);
        console.log(`User ${user.username || user.email} dailyProfitActivated status:`, user?.dailyProfitActivated);

        if (!hasDailyProfitActivated) {
          console.log(`User ${user.username || user.email} has NOT activated daily profit. Skipping...`);
          continue; // Skip this investment if user hasn't activated daily profit
        }

        console.log(`User ${user.username || user.email} has activated daily profit. Processing...`);

        // Check if user has met their daily login requirement
        const hasMetLoginRequirement = user?.rank_benefits_active !== false; // Default to true if not set

        // Calculate daily profit using user's trade booster if available and requirements are met
        let tradeBooster;
        if (hasMetLoginRequirement) {
            // User has met login requirements, use their rank's trade booster
            tradeBooster = user?.trade_booster || investment.daily_profit || 2.5;
            console.log(`User ${user.username || user.email} has met daily login requirements. Using rank trade booster: ${tradeBooster}%`);
        } else {
            // User has not met login requirements, use base rate (ACTIVE rank)
            tradeBooster = 2.5; // Base rate for ACTIVE rank
            console.log(`User ${user.username || user.email} has NOT met daily login requirements. Using base trade booster: ${tradeBooster}%`);
        }

        const dailyProfit = (investment.amount * tradeBooster) / 100;

        // If user has level ROI income enabled and has met login requirements, process it
        if (user?.level_roi_income > 0 && hasMetLoginRequirement) {
          // Get user's 4th level referrals
          const topLevels = await getTopLevelByRefer(user._id, 4);
          if (topLevels.length >= 4 && topLevels[3]) { // Check if 4th level exists
            const level4Users = topLevels[3];

            // Calculate ROI for each 4th level user based on user's level_roi_income setting
            for (let i = 0; i < Math.min(user.level_roi_income, level4Users.length); i++) {
              const level4UserId = level4Users[i];
              const roiAmount = dailyProfit * 0.05; // 5% of daily profit

              // Add ROI to level 4 user's wallet
              await userDbHandler.updateById(level4UserId, {
                $inc: {
                  wallet: roiAmount,
                  "extra.levelRoiIncome": roiAmount
                }
              });

              // Create income record
              await incomeDbHandler.create({
                user_id: ObjectId(level4UserId),
                user_id_from: ObjectId(user._id),
                type: 'level_roi_income',
                amount: roiAmount,
                status: 'credited',
                level: 4,
                description: 'Level 4 ROI Income',
                extra: {
                  fromUser: user.username,
                  dailyProfit: dailyProfit
                }
              });
            }
          }
        }
        totalProfit += dailyProfit;

        console.log(`Processing profit for investment ${investment._id}: $${dailyProfit} (${investment.daily_profit || 2.5}% of $${investment.amount})`);

        try {
          // Add profit to user's wallet
          const walletUpdate = await userDbHandler.updateById(investment.user_id, {
            $inc: {
              wallet: dailyProfit,
              "extra.dailyProfit": dailyProfit
            }
          });

          console.log(`Wallet update result for user ${investment.user_id}: ${walletUpdate ? 'Success' : 'Failed'}`);

          // Create income record
          const incomeRecord = await incomeDbHandler.create({
            user_id: ObjectId(investment.user_id),
            investment_id: investment._id,
            type: 'daily_profit',
            amount: dailyProfit,
            status: 'credited',
            description: 'Daily trading profit',
            extra: {
              investmentAmount: investment.amount,
              profitPercentage: investment.daily_profit || 2.5
            }
          });

          console.log(`Income record created: ${incomeRecord ? 'Success' : 'Failed'}`);

          // Update last profit date
          const dateUpdate = await investmentDbHandler.updateById(investment._id, {
            last_profit_date: today
          });

          console.log(`Last profit date updated: ${dateUpdate ? 'Success' : 'Failed'}`);

          processedCount++;
        } catch (investmentError) {
          console.error(`Error processing profit for investment ${investment._id}:`, investmentError);
        }
      }
    }

    console.log(`Daily profit processing completed. Processed ${processedCount} investments with total profit of $${totalProfit.toFixed(2)}`);
    return { success: true, processedCount, totalProfit };
  } catch (error) {
    console.error('Error processing daily trading profit:', error);
    return { success: false, error: error.message };
  }
};

// API endpoint for processing daily trading profit
const processDailyTradingProfit = async (req, res) => {
  try {
    console.log("processDailyTradingProfit");
    const result = await _processDailyTradingProfit();

    if (result.success) {
      return res.status(200).json({
        status: true,
        message: 'Daily trading profit processed successfully',
        data: {
          processedInvestments: result.processedCount,
          totalProfit: result.totalProfit
        }
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'Failed to process daily trading profit',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in daily profit API endpoint:', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing daily trading profit',
      error: error.message
    });
  }
};

// Schedule daily profit distribution
cron.schedule('0 0 * * *', _processDailyTradingProfit, {
  scheduled: true,
  timezone: "UTC"
});

// Schedule active member rewards check (weekly)
cron.schedule('0 0 * * 0', _processActiveMemberReward, {
  scheduled: true,
  timezone: "UTC"
});

// Schedule user rank updates (daily)
cron.schedule('0 1 * * *', () => _processUserRanks(), {
  scheduled: true,
  timezone: "UTC"
});

// Schedule team rewards processing (daily) - COMMENTED OUT (not needed for initial launch)
// cron.schedule('0 2 * * *', processTeamRewards, {
//   scheduled: true,
//   timezone: "UTC"
// });

// Reset daily login counters and profit activation at midnight
const resetDailyLoginCounters = async (req, res) => {
  try {
    console.log('Resetting daily login counters and profit activation...');

    // Get all users directly using mongoose
    let updatedCount = 0;
    try {
      const mongoose = require('mongoose');
      const User = mongoose.model('Users');
      const users = await User.find({});

      console.log(`Found ${users.length} users using direct mongoose query`);

      // Update each user individually
      for (const user of users) {
        await userDbHandler.updateById(user._id, {
          daily_logins: 0,
          rank_benefits_active: false,
          dailyProfitActivated: false // Reset daily profit activation directly
        });
        console.log(`Reset daily profit activation for user ${user.username || user.email}`);
        updatedCount++;
      }
    } catch (mongooseError) {
      console.error('Error querying users with mongoose:', mongooseError);
      throw mongooseError;
    }

    console.log(`Reset daily login counters for ${updatedCount} users`);

    // If this is called as an API endpoint, return a response
    if (res) {
      return res.status(200).json({
        status: true,
        message: 'Daily login counters reset successfully',
        data: { updatedCount }
      });
    }

    return { success: true, message: 'Daily login counters reset successfully', updatedCount };
  } catch (error) {
    console.error('Error resetting daily login counters:', error);

    // If this is called as an API endpoint, return a response
    if (res) {
      return res.status(500).json({
        status: false,
        message: 'Failed to reset daily login counters',
        error: error.message
      });
    }

    return { success: false, message: 'Failed to reset daily login counters', error };
  }
};

// Schedule daily login counter reset at midnight
cron.schedule('0 0 * * *', () => resetDailyLoginCounters(null, null), {
  scheduled: true,
  timezone: "UTC"
});

module.exports = {
  distributeTokensHandler,
  distributeLevelIncome,
  distributeGlobalAutoPoolMatrixIncome,
  AutoFundDistribution,
  processTeamCommission,
  processActiveMemberReward,
  processDailyTradingProfit,
  processUserRanks,
  processTeamRewards,
  resetDailyLoginCounters
};
