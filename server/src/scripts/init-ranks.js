'use strict';
const mongoose = require('mongoose');
const config = require('../config/config');
const { rankModel } = require('../models');

// Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Rank data based on the provided table
const rankData = [
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
    trade_booster: 3,
    level_roi_income: 1
  },
  {
    name: 'VETERAM',
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
    trade_booster: 4,
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

// Function to initialize ranks
const initRanks = async () => {
  try {
    // Clear existing ranks
    await rankModel.deleteMany({});
    console.log('Cleared existing ranks');

    // Insert new ranks
    const result = await rankModel.insertMany(rankData);
    console.log(`Inserted ${result.length} ranks`);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing ranks:', error);
    mongoose.disconnect();
  }
};

// Run the initialization
initRanks();
