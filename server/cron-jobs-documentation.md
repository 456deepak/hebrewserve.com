# HebrewServe Cron Jobs Documentation

This document provides information about the cron jobs used in the HebrewServe business plan and how to manually trigger them if needed.

## Scheduled Cron Jobs

The following cron jobs are scheduled to run automatically:

1. **Daily Trading Profit Calculation** - Runs at midnight UTC every day
   - Calculates and distributes the 2.5% daily profit to users who have activated daily profit

2. **Active Member Rewards Check** - Runs at midnight UTC every Sunday
   - Processes rewards based on direct referrals and team size

3. **User Rank Updates** - Runs at 1 AM UTC every day
   - Updates user ranks based on trade balance and active team size

4. **Team Rewards Processing** - Runs at 2 AM UTC every day
   - Processes team rewards based on team deposit and time period

5. **Reset Daily Login Counters and Profit Activation** - Runs at midnight UTC every day
   - Resets daily profit activation and login counters

## Manually Triggering Cron Jobs

You can manually trigger any of the cron jobs using the following API endpoints:

1. **Process Daily Trading Profit**
   ```
   POST /api/v1/cron/processDailyProfit
   ```

2. **Process Active Member Rewards**
   ```
   POST /api/v1/cron/processActiveMemberRewards
   ```

3. **Process User Ranks**
   ```
   POST /api/v1/cron/processUserRanks
   ```

4. **Process Team Rewards**
   ```
   POST /api/v1/cron/processTeamRewards
   ```

5. **Reset Daily Login Counters**
   ```
   POST /api/v1/cron/resetDailyLoginCounters
   ```

### Authentication

All cron job API endpoints require an API key to be included in the request body:

```json
{
  "key": "XK7PZ8"
}
```

This key is defined in the `.env` file as `APP_API_KEY`.

### Example Using cURL

```bash
curl -X POST http://localhost:5000/api/v1/cron/processDailyProfit \
  -H "Content-Type: application/json" \
  -d '{"key": "XK7PZ8"}'
```

### Example Using Postman

1. Create a new POST request to `http://localhost:5000/api/v1/cron/processDailyProfit`
2. Set the Content-Type header to `application/json`
3. In the request body, select "raw" and "JSON", then enter:
   ```json
   {
     "key": "XK7PZ8"
   }
   ```
4. Send the request

## Troubleshooting

If you encounter an error like "Invalid Key" or "API key is required in request body", make sure:

1. You are including the `key` in the request body
2. The key value matches the `APP_API_KEY` in your `.env` file
3. The request is being sent with the correct Content-Type header (`application/json`)

## Environment Variables

The following environment variables affect cron job behavior:

- `APP_API_KEY`: The API key required for manually triggering cron jobs (currently set to `XK7PZ8`)
- `CRON_STATUS`: Set to `0` to disable automatic cron jobs, or `1` to enable them
