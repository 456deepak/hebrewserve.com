import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Paper, Container, CircularProgress, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import axios from 'utils/axios';

const TestAPI = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [envInfo, setEnvInfo] = useState({});

  useEffect(() => {
    // Get environment information
    setEnvInfo({
      VITE_APP_TEST: import.meta.env.VITE_APP_TEST,
      VITE_APP_TEST_API_URL: import.meta.env.VITE_APP_TEST_API_URL,
      VITE_APP_PROD_API_URL: import.meta.env.VITE_APP_PROD_API_URL,
      VITE_APP_MAIN_PATH: import.meta.env.VITE_APP_MAIN_PATH,
      VITE_APP_BASE_NAME: import.meta.env.VITE_APP_BASE_NAME,
    });
  }, []);

  const testEndpoints = async () => {
    setLoading(true);
    setError(null);
    const testResults = {};

    try {
      // Test user profile endpoint
      try {
        const profileResponse = await axios.get('/user/profile');
        const isSuccess = profileResponse.data.status || profileResponse.data.success;
        const responseData = profileResponse.data.result || profileResponse.data.data;
        testResults.profile = {
          success: isSuccess,
          status: profileResponse.status,
          data: responseData ? 'Data received' : 'No data',
          format: profileResponse.data.result ? 'result format' : 'data format'
        };
      } catch (err) {
        testResults.profile = {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        };
      }

      // Test rank endpoints
      try {
        const ranksResponse = await axios.get('/get-all-ranks');
        const isSuccess = ranksResponse.data.status || ranksResponse.data.success;
        const responseData = ranksResponse.data.result || ranksResponse.data.data;
        const docs = responseData?.docs || responseData;
        testResults.ranks = {
          success: isSuccess,
          status: ranksResponse.status,
          data: docs ? `${Array.isArray(docs) ? docs.length : 0} ranks found` : 'No data',
          format: ranksResponse.data.result ? 'result format' : 'data format'
        };
      } catch (err) {
        testResults.ranks = {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        };
      }

      try {
        const userRankResponse = await axios.get('/get-user-rank');
        const isSuccess = userRankResponse.data.status || userRankResponse.data.success;
        const responseData = userRankResponse.data.result || userRankResponse.data.data;
        testResults.userRank = {
          success: isSuccess,
          status: userRankResponse.status,
          data: responseData ? 'Data received' : 'No data',
          format: userRankResponse.data.result ? 'result format' : 'data format'
        };
      } catch (err) {
        testResults.userRank = {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        };
      }

      // Test team reward endpoints
      try {
        const teamRewardsResponse = await axios.get('/get-all-team-rewards');
        const isSuccess = teamRewardsResponse.data.status || teamRewardsResponse.data.success;
        const responseData = teamRewardsResponse.data.result || teamRewardsResponse.data.data;
        const docs = responseData?.docs || responseData;
        testResults.teamRewards = {
          success: isSuccess,
          status: teamRewardsResponse.status,
          data: docs ? `${Array.isArray(docs) ? docs.length : 0} rewards found` : 'No data',
          format: teamRewardsResponse.data.result ? 'result format' : 'data format'
        };
      } catch (err) {
        testResults.teamRewards = {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        };
      }

      try {
        const teamRewardSumResponse = await axios.get('/get-team-reward-sum');
        const isSuccess = teamRewardSumResponse.data.status || teamRewardSumResponse.data.success;
        const responseData = teamRewardSumResponse.data.result || teamRewardSumResponse.data.data;
        testResults.teamRewardSum = {
          success: isSuccess,
          status: teamRewardSumResponse.status,
          data: responseData ? 'Data received' : 'No data',
          format: teamRewardSumResponse.data.result ? 'result format' : 'data format'
        };
      } catch (err) {
        testResults.teamRewardSum = {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        };
      }

      // Test custom endpoint if provided
      if (customEndpoint) {
        try {
          const customResponse = await axios.get(customEndpoint);
          const isSuccess = customResponse.data.status || customResponse.data.success || true;
          const responseData = customResponse.data.result || customResponse.data.data || customResponse.data;
          testResults.custom = {
            success: isSuccess,
            status: customResponse.status,
            data: 'Data received',
            format: customResponse.data.result ? 'result format' :
                   customResponse.data.data ? 'data format' : 'raw format',
            rawData: JSON.stringify(customResponse.data, null, 2)
          };
        } catch (err) {
          testResults.custom = {
            success: false,
            status: err.response?.status || 'Error',
            error: err.message
          };
        }
      }

      setResults(testResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!customEndpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(customEndpoint);
      const isSuccess = response.data.status || response.data.success || true;
      const responseData = response.data.result || response.data.data || response.data;
      setResults({
        custom: {
          success: isSuccess,
          status: response.status,
          data: 'Data received',
          format: response.data.result ? 'result format' :
                 response.data.data ? 'data format' : 'raw format',
          rawData: JSON.stringify(response.data, null, 2)
        }
      });
    } catch (err) {
      setResults({
        custom: {
          success: false,
          status: err.response?.status || 'Error',
          error: err.message
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          API Endpoint Test
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Test the API endpoints for the HebrewServe business plan
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Environment Variables">
            <Grid container spacing={2}>
              {Object.entries(envInfo).map(([key, value]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{key}</Typography>
                    <Typography variant="body2" color="text.secondary">{value || 'Not set'}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard title="Test Custom Endpoint">
            <Box sx={{ display: 'flex', mb: 3 }}>
              <TextField
                fullWidth
                label="API Endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="/user/profile"
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={testCustomEndpoint}
                disabled={loading || !customEndpoint}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Test'}
              </Button>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard title="Test API Endpoints">
            <Button
              variant="contained"
              color="primary"
              onClick={testEndpoints}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Test All Endpoints'}
            </Button>

            {error && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.dark' }}>
                <Typography color="white">{error}</Typography>
              </Paper>
            )}

            {Object.keys(results).length > 0 && (
              <Grid container spacing={2}>
                {Object.entries(results).map(([endpoint, result]) => (
                  <Grid item xs={12} md={6} key={endpoint}>
                    <Paper sx={{
                      p: 2,
                      bgcolor: result.success ? 'success.dark' : 'error.dark',
                      color: 'white'
                    }}>
                      <Typography variant="h6" gutterBottom>{endpoint}</Typography>
                      <Typography>Status: {result.status}</Typography>
                      <Typography>Success: {result.success ? 'Yes' : 'No'}</Typography>
                      {result.data && <Typography>Data: {result.data}</Typography>}
                      {result.error && <Typography>Error: {result.error}</Typography>}
                      {result.rawData && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                          <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {result.rawData}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestAPI;
