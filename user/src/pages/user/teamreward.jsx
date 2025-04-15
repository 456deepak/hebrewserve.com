import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, useTheme, alpha, Container, Paper, Avatar, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';
import { Chart, Wallet, People, MoneyRecive, TrendUp, DollarCircle, Copy, ArrowRight, Medal, Timer1 } from 'iconsax-react';
import axios from 'utils/axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { getFromCache, saveToCache } from 'utils/apiCache';

const TeamReward = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [teamRewards, setTeamRewards] = useState([]);
  const [teamRewardSum, setTeamRewardSum] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get data from cache first
        const cachedUserData = getFromCache('user_profile');
        const cachedTeamRewards = getFromCache('team_rewards');
        const cachedTeamRewardSum = getFromCache('team_reward_sum');

        // Set data from cache if available
        if (cachedUserData) {
          setUserData(cachedUserData);
        }

        if (cachedTeamRewards) {
          setTeamRewards(cachedTeamRewards);
        }

        if (cachedTeamRewardSum !== null) {
          setTeamRewardSum(cachedTeamRewardSum);
        }

        // If we have all data in cache, skip API calls
        if (cachedUserData && cachedTeamRewards && cachedTeamRewardSum !== null) {
          setLoading(false);
          return;
        }

        // Fetch user profile data if not in cache
        if (!cachedUserData) {
          const userResponse = await axios.get('/user/profile');
          if (userResponse.data.status || userResponse.data.success) {
            const userData = userResponse.data.result || userResponse.data.data;
            setUserData(userData);
            saveToCache('user_profile', userData);
          }
        }

        // Fetch team rewards if not in cache
        if (!cachedTeamRewards) {
          const rewardsResponse = await axios.get('/get-all-team-rewards');
          if (rewardsResponse.data.status || rewardsResponse.data.success) {
            const rewardsData = rewardsResponse.data.result || rewardsResponse.data.data;
            // Ensure teamRewards is always an array
            const teamRewardsArray = Array.isArray(rewardsData.docs || rewardsData) ?
              (rewardsData.docs || rewardsData) : [];
            setTeamRewards(teamRewardsArray);
            saveToCache('team_rewards', teamRewardsArray);
          }
        }

        // Fetch team reward sum if not in cache
        if (cachedTeamRewardSum === null) {
          const sumResponse = await axios.get('/get-team-reward-sum');
          const sumData = sumResponse.data.result || sumResponse.data.data;
          if ((sumResponse.data.status || sumResponse.data.success) && sumData && sumData.length > 0) {
            const rewardSum = sumData[0].reward_amount || 0;
            setTeamRewardSum(rewardSum);
            saveToCache('team_reward_sum', rewardSum);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch team reward data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate days remaining for a pending reward
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate progress percentage for a pending reward
  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    const totalDuration = end - start;
    const elapsed = now - start;

    const progress = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Team reward tiers for display
  const teamRewardTiers = [
    { team_deposit: 100000, time_period: 30, reward_amount: 15000 },
    { team_deposit: 300000, time_period: 60, reward_amount: 50000 },
    { team_deposit: 1200000, time_period: 90, reward_amount: 500000 }
  ];

  return (
    <Container maxWidth="xl">
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          Team Rewards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Earn rewards based on your team's performance
        </Typography>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Team Deposit Card */}
          <Grid item xs={12} md={6}>
            <MainCard title="Your Team Deposit">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    p: 1.5,
                    mr: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  <People variant="Bold" size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white">
                    ${userData?.extra?.teamDeposit?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total team deposit
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Team members
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Direct referrals
                  </Typography>
                  <Typography variant="body2" color="white">
                    {userData?.extra?.directReferrals || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total team size
                  </Typography>
                  <Typography variant="body2" color="white">
                    {userData?.extra?.teamSize || 0}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total team rewards earned
                </Typography>
                <Typography variant="h5" color="white">
                  ${teamRewardSum.toFixed(2)}
                </Typography>
              </Box>
            </MainCard>
          </Grid>

          {/* Active Team Rewards */}
          <Grid item xs={12} md={6}>
            <MainCard title="Active Team Rewards">
              {teamRewards.filter(reward => reward.status === 'pending').length > 0 ? (
                teamRewards
                  .filter(reward => reward.status === 'pending')
                  .map((reward) => (
                    <Box key={reward._id} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1" color="white">
                            ${reward.reward_amount.toFixed(2)} Reward
                          </Typography>
                          <Chip
                            label="PENDING"
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.main
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Timer1 size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {calculateDaysRemaining(reward.end_date)} days remaining
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={calculateProgress(reward.start_date, reward.end_date)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                bgcolor: theme.palette.warning.main
                              }
                            }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          {reward.remarks}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No active team rewards
                  </Typography>
                </Box>
              )}
            </MainCard>
          </Grid>

          {/* Team Reward Tiers */}
          <Grid item xs={12}>
            <MainCard title="Team Reward Tiers">
              <Grid container spacing={3}>
                {teamRewardTiers.map((tier, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h5" color="white">
                            ${tier.reward_amount.toLocaleString()}
                          </Typography>
                          <Chip
                            label={`${tier.time_period} DAYS`}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Requirements
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Team deposit
                            </Typography>
                            <Typography variant="body2" color="white">
                              ${tier.team_deposit.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Maintenance period
                            </Typography>
                            <Typography variant="body2" color="white">
                              {tier.time_period} days
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, ((userData?.extra?.teamDeposit || 0) / tier.team_deposit) * 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                bgcolor: theme.palette.primary.main
                              }
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Your progress
                            </Typography>
                            <Typography variant="body2" color="white">
                              {Math.min(100, ((userData?.extra?.teamDeposit || 0) / tier.team_deposit * 100).toFixed(0))}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MainCard>
          </Grid>

          {/* Completed Team Rewards */}
          <Grid item xs={12}>
            <MainCard title="Completed Team Rewards">
              {teamRewards.filter(reward => reward.status === 'completed').length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Team Deposit</TableCell>
                        <TableCell>Time Period</TableCell>
                        <TableCell>Reward Amount</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamRewards
                        .filter(reward => reward.status === 'completed')
                        .map((reward) => (
                          <TableRow key={reward._id}>
                            <TableCell>${reward.team_deposit.toLocaleString()}</TableCell>
                            <TableCell>{reward.time_period} days</TableCell>
                            <TableCell>${reward.reward_amount.toLocaleString()}</TableCell>
                            <TableCell>{format(new Date(reward.start_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{format(new Date(reward.end_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <Chip
                                label="COMPLETED"
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.main
                                }}
                              />
                            </TableCell>
                            <TableCell>{reward.remarks}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No completed team rewards yet
                  </Typography>
                </Box>
              )}
            </MainCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TeamReward;
