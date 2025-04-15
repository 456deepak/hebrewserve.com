/**
 * Script to update the last_profit_date of investments for testing
 * 
 * Usage: node update-last-profit-date.js
 */

const mongoose = require('mongoose');
const config = require('../config/config');
const Investment = require('../models/investment.model');

// Connect to MongoDB
mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  updateLastProfitDates();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function updateLastProfitDates() {
  try {
    // Set the last_profit_date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    console.log(`Setting last_profit_date to: ${yesterday.toISOString()}`);
    
    // Update all active investments
    const result = await Investment.updateMany(
      { status: 'active' },
      { $set: { last_profit_date: yesterday } }
    );
    
    console.log(`Updated ${result.modifiedCount} investments`);
    
    // Verify the updates
    const investments = await Investment.find({ status: 'active' });
    console.log(`Active investments: ${investments.length}`);
    
    investments.forEach(investment => {
      console.log(`Investment ID: ${investment._id}, Amount: $${investment.amount}, Last profit date: ${investment.last_profit_date}`);
    });
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating last_profit_date:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}
