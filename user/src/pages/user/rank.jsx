import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, useTheme, alpha, Container, Paper, Avatar, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import { Chart, Wallet, People, MoneyRecive, TrendUp, DollarCircle, Copy, ArrowRight, Medal } from 'iconsax-react';
import axios from 'utils/axios';
import Swal from 'sweetalert2';
import { getFromCache, saveToCache } from 'utils/apiCache';

const UserRank = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [rankData, setRankData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get data from cache first
        const cachedUserData = getFromCache('user_profile');
        const cachedRankData = getFromCache('rank_data');
        const cachedUserRank = getFromCache('user_rank');

        // Set data from cache if available
        if (cachedUserData) {
          setUserData(cachedUserData);
        }

        if (cachedRankData) {
          setRankData(cachedRankData);
        }

        if (cachedUserRank) {
          setUserRank(cachedUserRank);
        }

        // If we have all data in cache, skip API calls
        if (cachedUserData && cachedRankData && cachedUserRank) {
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

        // Fetch all ranks if not in cache
        if (!cachedRankData) {
          const ranksResponse = await axios.get('/get-all-ranks');
          if (ranksResponse.data.status || ranksResponse.data.success) {
            const ranksData = ranksResponse.data.result || ranksResponse.data.data;
            // Ensure rankData is always an array
            const rankDataArray = Array.isArray(ranksData.docs || ranksData) ?
              (ranksData.docs || ranksData) : [];
            setRankData(rankDataArray);
            saveToCache('rank_data', rankDataArray);
          }
        }

        // Fetch user's current rank if not in cache
        if (!cachedUserRank) {
          const userRankResponse = await axios.get('/get-user-rank');
          if (userRankResponse.data.status || userRankResponse.data.success) {
            const userRankData = userRankResponse.data.result || userRankResponse.data.data;
            setUserRank(userRankData);
            saveToCache('user_rank', userRankData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch rank data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate progress to next rank
  const calculateProgress = () => {
    if (!userData || !rankData || rankData.length === 0 || !userRank) return 0;

    const currentRankIndex = rankData.findIndex(rank => rank.name === userData.rank);
    if (currentRankIndex === -1 || currentRankIndex === rankData.length - 1) return 100; // Already at highest rank

    const nextRank = rankData[currentRankIndex + 1];

    // Calculate investment progress
    const investmentProgress = Math.min(100, (userData.total_investment / nextRank.min_trade_balance) * 100);

    // Calculate team progress
    const directReferrals = userData.extra?.directReferrals || 0;
    const teamProgress = Math.min(100, (directReferrals / nextRank.active_team) * 100);

    // Return the lower of the two progress values
    return Math.min(investmentProgress, teamProgress);
  };

  return (
    <Container maxWidth="xl">
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          User Rank
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your current rank and benefits
        </Typography>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Current Rank Card */}
          <Grid item xs={12} md={6}>
            <MainCard title="Your Current Rank">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    p: 1.5,
                    mr: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  <Medal variant="Bold" size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white">
                    {userData?.rank || 'ACTIVE'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your current rank level
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progress to next rank
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress()}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      bgcolor: theme.palette.primary.main
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                  {calculateProgress().toFixed(0)}%
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Trade Booster
                    </Typography>
                    <Typography variant="h6" color="white">
                      {userData?.trade_booster || 2.5}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Level ROI Income
                    </Typography>
                    <Typography variant="h6" color="white">
                      {userData?.level_roi_income || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Daily Limit View
                    </Typography>
                    <Typography variant="h6" color="white">
                      {userRank?.daily_limit_view || 1}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Active Team
                    </Typography>
                    <Typography variant="h6" color="white">
                      {userData?.extra?.directReferrals || 0} / {userRank?.active_team || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          {/* Rank Requirements Card */}
          <Grid item xs={12} md={6}>
            <MainCard title="Your Investment">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    p: 1.5,
                    mr: 2,
                    color: theme.palette.success.main
                  }}
                >
                  <Wallet variant="Bold" size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white">
                    ${userData?.total_investment?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your total investment
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Investment requirement for next rank
                </Typography>
                {userData?.rank !== 'SUPREME' ? (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (userData?.total_investment / (userRank?.min_trade_balance || 1)) * 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          bgcolor: theme.palette.success.main
                        }
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                      {Math.min(100, ((userData?.total_investment || 0) / (userRank?.min_trade_balance || 1) * 100).toFixed(0))}%
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                    You have reached the highest rank!
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Team requirement for next rank
                </Typography>
                {userData?.rank !== 'SUPREME' ? (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, ((userData?.extra?.directReferrals || 0) / (userRank?.active_team || 1)) * 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          bgcolor: theme.palette.warning.main
                        }
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                      {Math.min(100, ((userData?.extra?.directReferrals || 0) / (userRank?.active_team || 1) * 100).toFixed(0))}%
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                    You have reached the highest rank!
                  </Typography>
                )}
              </Box>
            </MainCard>
          </Grid>

          {/* Rank Table */}
          <Grid item xs={12}>
            <MainCard title="Rank Benefits">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Min Trade Balance</TableCell>
                      <TableCell>Active Team</TableCell>
                      <TableCell>Daily Limit View</TableCell>
                      <TableCell>Trade Booster</TableCell>
                      <TableCell>Level ROI Income</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankData.map((rank) => (
                      <TableRow
                        key={rank.name}
                        sx={{
                          bgcolor: rank.name === userData?.rank ? alpha(theme.palette.primary.main, 0.1) : 'inherit',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                mr: 1,
                                bgcolor: rank.name === userData?.rank ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2),
                                color: rank.name === userData?.rank ? 'white' : theme.palette.primary.main
                              }}
                            >
                              <Medal size={16} variant={rank.name === userData?.rank ? "Bold" : "Outline"} />
                            </Avatar>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: rank.name === userData?.rank ? 'bold' : 'normal',
                                color: rank.name === userData?.rank ? theme.palette.primary.main : 'inherit'
                              }}
                            >
                              {rank.name}
                              {rank.name === userData?.rank && (
                                <Chip
                                  label="CURRENT"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    height: 20,
                                    fontSize: '0.7rem'
                                  }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>${rank.min_trade_balance}</TableCell>
                        <TableCell>{rank.active_team}</TableCell>
                        <TableCell>{rank.daily_limit_view}</TableCell>
                        <TableCell>{rank.trade_booster}%</TableCell>
                        <TableCell>{rank.level_roi_income}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default UserRank;
