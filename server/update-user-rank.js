const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hebrewserve')
  .then(() => {
    console.log('Connected to MongoDB');

    // Define User model
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      refer_id: mongoose.Schema.Types.Mixed,
      total_investment: Number,
      rank: String,
      trade_booster: Number,
      level_roi_income: Number,
      daily_limit_view: Number,
      daily_logins: Number,
      rank_benefits_active: Boolean
    });

    const User = mongoose.model('Users', userSchema);

    // Define Rank model
    const rankSchema = new mongoose.Schema({
      name: String,
      min_trade_balance: Number,
      active_team: Number,
      daily_limit_view: Number,
      trade_booster: Number,
      level_roi_income: Number
    });

    const Rank = mongoose.model('Ranks', rankSchema);

    async function updateUserRank() {
      try {
        // Get User A
        const userA = await User.findOne({ email: 'usera@test.com' });
        if (!userA) {
          console.log('User A not found');
          return;
        }

        console.log('Found User A:');
        console.log(`- Username: ${userA.username || userA.email}`);
        console.log(`- Total investment: $${userA.total_investment}`);
        console.log(`- Current rank: ${userA.rank}`);
        console.log(`- Current trade booster: ${userA.trade_booster}%`);

        // Get direct referrals
        const directReferrals = await User.find({ refer_id: userA._id });
        console.log(`- Direct referrals: ${directReferrals.length}`);
        directReferrals.forEach((ref, index) => {
          console.log(`  ${index + 1}. ${ref.username || ref.email} (Investment: $${ref.total_investment})`);
        });

        // Get all ranks
        const ranks = await Rank.find({}).sort({ min_trade_balance: -1 });

        // Find the highest rank the user qualifies for
        let newRank = 'ACTIVE'; // Default rank
        let qualifiedRank = null;

        for (const rank of ranks) {
          console.log(`\nChecking rank ${rank.name}:`);
          console.log(`- Required investment: $${rank.min_trade_balance}`);
          console.log(`- Required team size: ${rank.active_team}`);

          // Check if user meets the investment and team size requirements
          if (userA.total_investment >= rank.min_trade_balance && directReferrals.length >= rank.active_team) {
            qualifiedRank = rank;
            newRank = rank.name;
            console.log(`User qualifies for rank: ${newRank}`);
            break;
          } else {
            console.log(`User does not qualify for rank: ${rank.name}`);
          }
        }

        // If no rank was found, use ACTIVE as default
        if (!qualifiedRank) {
          console.log(`\nUser does not qualify for any rank, using default: ACTIVE`);
          qualifiedRank = await Rank.findOne({ name: 'ACTIVE' });
        }

        // Update user's rank
        console.log(`\nUpdating user rank to: ${newRank}`);
        const updateResult = await User.updateOne(
          { _id: userA._id },
          {
            rank: newRank,
            trade_booster: qualifiedRank.trade_booster,
            level_roi_income: qualifiedRank.level_roi_income,
            daily_limit_view: qualifiedRank.daily_limit_view,
            daily_logins: 3, // Set to 3 to ensure rank benefits are active
            rank_benefits_active: true
          }
        );

        console.log('Update result:', updateResult);

        // Verify the update
        const updatedUser = await User.findOne({ email: 'usera@test.com' });
        console.log('\nUpdated User A:');
        console.log(`- Username: ${updatedUser.username || updatedUser.email}`);
        console.log(`- Total investment: $${updatedUser.total_investment}`);
        console.log(`- New rank: ${updatedUser.rank}`);
        console.log(`- New trade booster: ${updatedUser.trade_booster}%`);
        console.log(`- New level ROI income: ${updatedUser.level_roi_income}`);
        console.log(`- New daily limit view: ${updatedUser.daily_limit_view}`);
        console.log(`- Daily logins: ${updatedUser.daily_logins}`);
        console.log(`- Rank benefits active: ${updatedUser.rank_benefits_active}`);

      } catch (error) {
        console.error('Error updating user rank:', error);
      } finally {
        mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
      }
    }

    updateUserRank();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
