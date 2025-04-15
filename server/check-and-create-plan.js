// Check and create investment plan
const mongoose = require('mongoose');

// Define the schema directly in this file to avoid import issues
const investmentPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  amount_from: {
    type: Number,
    default: 50
  },
  amount_to: {
    type: Number,
    default: 10000
  },
  percentage: {
    type: Number,
    default: 2.5
  },
  days: {
    type: Number,
    default: 1
  },
  frequency_in_days: {
    type: Number,
    default: 1
  },
  first_deposit_bonus: {
    type: Object,
    default: {
      100: 7,
      500: 15,
      1000: 50,
      3000: 100,
      5000: 200,
      10000: 500
    }
  },
  referral_bonus: {
    type: Object,
    default: {
      100: 5,
      500: 50,
      1000: 90,
      3000: 250,
      5000: 500,
      10000: 700
    }
  },
  team_commission: {
    type: Object,
    default: {
      level1: 16,
      level2: 8,
      level3: 4
    }
  },
  active_member_rewards: {
    type: Array,
    default: [
      { direct: 5, team: 20, reward: 90 },
      { direct: 7, team: 50, reward: 150 },
      { direct: 9, team: 100, reward: 250 },
      { direct: 11, team: 300, reward: 400 },
      { direct: 15, team: 600, reward: 500 },
      { direct: 20, team: 1000, reward: 600 },
      { direct: 30, team: 3000, reward: 1500 },
      { direct: 40, team: 6000, reward: 3000 },
      { direct: 50, team: 10000, reward: 6000 },
      { direct: 60, team: 30000, reward: 12000 },
      { direct: 70, team: 60000, reward: 20000 },
      { direct: 80, team: 100000, reward: 30000 },
      { direct: 90, team: 300000, reward: 50000 },
      { direct: 100, team: 600000, reward: 110000 },
      { direct: 110, team: 1000000, reward: 200000 }
    ]
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

// Create the model
const InvestmentPlan = mongoose.model('InvestmentPlans', investmentPlanSchema);

mongoose.connect('mongodb+srv://dev3brt:dev3@cluster0.vwped.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if plan exists
    const existingPlan = await InvestmentPlan.findOne({title: 'Trading Package'});
    
    if (!existingPlan) {
      console.log('No investment plan found. Creating one...');
      
      // Create default plan
      const plan = new InvestmentPlan({
        title: 'Trading Package',
        amount_from: 50,
        amount_to: 10000,
        percentage: 2.5,
        days: 1,
        frequency_in_days: 1,
        first_deposit_bonus: {
          100: 7,
          500: 15,
          1000: 50,
          3000: 100,
          5000: 200,
          10000: 500
        },
        referral_bonus: {
          100: 5,
          500: 50,
          1000: 90,
          3000: 250,
          5000: 500,
          10000: 700
        },
        team_commission: {
          level1: 16,
          level2: 8,
          level3: 4
        },
        status: true
      });
      
      await plan.save();
      console.log('Investment plan created successfully');
    } else {
      console.log('Investment plan already exists:', existingPlan.title);
    }
    
    // List all plans
    const allPlans = await InvestmentPlan.find({});
    console.log('All investment plans:', allPlans.map(p => p.title));
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
