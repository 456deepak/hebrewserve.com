// Script to update rank data
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://dev3brt:dev3@cluster0.vwped.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Define Rank model directly
      const rankSchema = new mongoose.Schema({
        name: {
          type: String,
          required: true,
          enum: ['ACTIVE', 'PRIME', 'VETERAM', 'ROYAL', 'SUPREME']
        },
        min_trade_balance: {
          type: Number,
          required: true
        },
        active_team: {
          type: Number,
          required: true
        },
        daily_limit_view: {
          type: Number,
          required: true
        },
        trade_booster: {
          type: Number,
          required: true
        },
        level_roi_income: {
          type: Number,
          required: true
        },
        status: {
          type: Boolean,
          default: true
        },
        extra: {
          type: Object,
          default: {}
        }
      }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
      
      // Create model
      const Rank = mongoose.model('Ranks', rankSchema);
      
      // Delete existing ranks
      await Rank.deleteMany({});
      console.log('Deleted existing ranks');
      
      // Create new ranks based on the table
      const ranks = [
        {
          name: 'ACTIVE',
          min_trade_balance: 50,
          active_team: 0,
          daily_limit_view: 1,
          trade_booster: 2.5,
          level_roi_income: 0
        },
        {
          name: 'PRIME',
          min_trade_balance: 500,
          active_team: 5,
          daily_limit_view: 2,
          trade_booster: 3.0,
          level_roi_income: 1
        },
        {
          name: 'VETERAM',  // Note: This is a typo in the original table (should be VETERAN)
          min_trade_balance: 2000,
          active_team: 11,
          daily_limit_view: 3,
          trade_booster: 3.5,
          level_roi_income: 2
        },
        {
          name: 'ROYAL',
          min_trade_balance: 5000,
          active_team: 22,
          daily_limit_view: 4,
          trade_booster: 4.0,
          level_roi_income: 3
        },
        {
          name: 'SUPREME',
          min_trade_balance: 20000,
          active_team: 60,
          daily_limit_view: 5,
          trade_booster: 4.5,
          level_roi_income: 5
        }
      ];
      
      // Insert ranks
      await Rank.insertMany(ranks);
      console.log('Created new ranks');
      
      // Verify ranks were created
      const createdRanks = await Rank.find({}).sort({ min_trade_balance: 1 });
      console.log('\nRanks in the database:');
      createdRanks.forEach(rank => {
        console.log(`${rank.name}:`);
        console.log(`- Min Trade Balance: $${rank.min_trade_balance}`);
        console.log(`- Active Team: ${rank.active_team}`);
        console.log(`- Daily Limit View: ${rank.daily_limit_view}`);
        console.log(`- Trade Booster: ${rank.trade_booster}%`);
        console.log(`- Level ROI Income: ${rank.level_roi_income}`);
        console.log('---');
      });
      
    } catch (error) {
      console.error('Error updating ranks:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
