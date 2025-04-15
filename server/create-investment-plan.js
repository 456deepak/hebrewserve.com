// Create investment plan
const mongoose = require('mongoose');
const InvestmentPlan = require('./src/models/investmentPlan.model');

mongoose.connect('mongodb+srv://dev3brt:dev3@cluster0.vwped.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
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
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
