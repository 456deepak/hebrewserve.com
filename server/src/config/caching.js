const { config } = require("dotenv");
const { LRUCache } = require('lru-cache');
/*************************
 * ENVIRONMENT VARIABLES 
 **************************/
module.exports = {
    // Existing configuration...
    
    // LRU Cache configuration
    lruCache: {
        default: {
            max: 100,               // Maximum number of items to store
            ttl: 1000 * 60 * 15,    // Time to live: 15 minutes (in milliseconds)
            updateAgeOnGet: true    // Update item age on access
        },
        // Specific cache configurations for different services
        income: {
            max: 200,               // More capacity for income service
            ttl: 1000 * 60 * 10     // 10 minutes TTL
        },
        user: {
            max: 500,               // Higher capacity for user data
            ttl: 1000 * 60 * 30     // 30 minutes TTL
        },
        settings: {
            max: 50,                // Settings change less frequently
            ttl: 1000 * 60 * 60     // 1 hour TTL
        }
    },
    
    // Rest of existing configuration...
};