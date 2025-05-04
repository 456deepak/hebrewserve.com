'use strict';
const server = require('./src/server');
const log = require('./src/services/logger').getAppLevelInstance();
const cron = require('node-cron');
const axios = require('axios');
const investmentPlanController = require('./src/controllers/user/investmentplan.controller');
const seedDefaultInvestmentPlan = require('./src/seeders/investmentplan.seeder');

// Import cron controller functions
const {
  _processDailyTradingProfit,
  _processTeamRewards,
  _processActiveMemberReward,
  _processUserRanks,
  resetDailyLoginCounters
} = require('./src/controllers/user/cron.controller');

/*************************************************************************************/
/* START PROCESS UNHANDLED METHODS */
/*************************************************************************************/
process.on('unhandledRejection', (reason, p) => {
	log.error('Unhandled Rejection at:', p, 'reason:', reason);
	log.error(`API server exiting due to unhandledRejection...`);
	process.exit(1);
});
process.on('uncaughtException', (err) => {
	log.error('Uncaught Exception:', err);
	log.error(`API server exiting due to uncaughtException...`);
	process.exit(1);
});
/*************************************************************************************/
/* END PROCESS UNHANDLED METHODS */
/*************************************************************************************/

// Daily profit calculation cron job - COMMENTED OUT (using the one in cron.controller.js instead)
// cron.schedule('0 0 * * *', async () => {
// 	try {
// 		if (process.env.CRON_STATUS === '0') return;
// 		log.info('Starting daily profit calculation...');
// 		await investmentPlanController.calculateDailyProfits();
// 		log.info('Daily profit calculation completed successfully.');
// 	} catch (error) {
// 		log.error('Error in daily profit calculation:', error);
// 	}
// });

// Active member rewards check cron job - COMMENTED OUT (using the one in cron.controller.js instead)
// cron.schedule('0 1 * * *', async () => {
// 	try {
// 		if (process.env.CRON_STATUS === '0') return;
// 		log.info('Starting active member rewards check...');
// 		const activeUsers = await User.find({ status: 'active' });
// 		for (const user of activeUsers) {
// 			await investmentPlanController.checkActiveMemberRewards(user._id);
// 		}
// 		log.info('Active member rewards check completed successfully.');
// 	} catch (error) {
// 		log.error('Error in active member rewards check:', error);
// 	}
// });

/**
 * Run seed scripts
 */

// Schedule daily profit distribution and login counter reset
// Runs at midnight (00:00) UTC every day
// First processes daily trading profit, then resets daily login counters
// This ensures ROI is calculated before counters are reset
cron.schedule('0 0 * * *', async () => {
  try {
    log.info('Starting daily profit distribution...');
    await _processDailyTradingProfit();
    log.info('Daily profit distribution completed successfully.');

    log.info('Starting daily login counter reset...');
    await resetDailyLoginCounters(null, null);
    log.info('Daily login counter reset completed successfully.');
  } catch (error) {
    log.error('Error in daily profit distribution or login counter reset:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

// Schedule team rewards processing (daily)
// Runs at 2:00 AM UTC every day
// Processes team rewards based on team deposit and time period
cron.schedule('0 2 * * *', async () => {
  try {
    log.info('Starting team rewards processing...');
    await _processTeamRewards();
    log.info('Team rewards processing completed successfully.');
  } catch (error) {
    log.error('Error in team rewards processing:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

// Schedule active member rewards check (weekly)
// Runs at midnight (00:00) UTC every Sunday (day 0)
// Processes rewards for active members based on direct referrals and team size
cron.schedule('0 0 * * 0', async () => {
  try {
    log.info('Starting active member rewards check...');
    await _processActiveMemberReward();
    log.info('Active member rewards check completed successfully.');
  } catch (error) {
    log.error('Error in active member rewards check:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

// Schedule user rank updates (daily)
// Runs at 1:00 AM UTC every day
// Updates user ranks based on trade balance and active team size
cron.schedule('0 1 * * *', async () => {
  try {
    log.info('Starting user rank updates...');
    await _processUserRanks();
    log.info('User rank updates completed successfully.');
  } catch (error) {
    log.error('Error in user rank updates:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

seedDefaultInvestmentPlan().then(() => {
    log.info('Seed scripts completed');
}).catch(err => {
    log.error('Error running seed scripts:', err);
});

/**
 * START THE SERVER
 */
const appServer = new server();
appServer.start();
