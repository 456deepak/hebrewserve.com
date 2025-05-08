import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

// ==============================|| TRADING PACKAGE PAGE ||============================== //

const TradingPackage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openReleaseDialog, setOpenReleaseDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [releaseAmount, setReleaseAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInvestments, setUserInvestments] = useState([]);
  const [userWallet, setUserWallet] = useState(0);
  const [userTopupWallet, setUserTopupWallet] = useState(0);

  // Min and max investment limits
  const minInvestment = 50;
  const maxInvestment = 10000;

  // First deposit bonus table data
  const firstDepositBonusData = [
    { amount: 100, bonus: 7 },
    { amount: 500, bonus: 15 },
    { amount: 1000, bonus: 50 },
    { amount: 3000, bonus: 100 },
    { amount: 5000, bonus: 200 },
    { amount: 10000, bonus: 500 }
  ];

  // Direct referral bonus table data
  const directReferralBonusData = [
    { amount: 100, bonus: 5 },
    { amount: 500, bonus: 50 },
    { amount: 1000, bonus: 90 },
    { amount: 3000, bonus: 250 },
    { amount: 5000, bonus: 500 },
    { amount: 10000, bonus: 700 }
  ];

  // Team commission data
  const teamCommissionData = [
    { level: '1st Level', bonus: '16%', requirement: 'One Direct compulsory' },
    { level: '2nd Level', bonus: '8%', requirement: 'One Direct compulsory' },
    { level: '3rd Level', bonus: '4%', requirement: 'One Direct compulsory' }
  ];

  // Active member reward data
  const activeMemberRewardData = [
    { directReferrals: 5, teamRecruitment: 20, reward: 90 },
    { directReferrals: 7, teamRecruitment: 50, reward: 150 },
    { directReferrals: 9, teamRecruitment: 100, reward: 250 },
    { directReferrals: 11, teamRecruitment: 300, reward: 400 },
    { directReferrals: 15, teamRecruitment: 600, reward: 500 },
    { directReferrals: 20, teamRecruitment: 1000, reward: 600 },
    { directReferrals: 30, teamRecruitment: 3000, reward: 1500 },
    { directReferrals: 40, teamRecruitment: 6000, reward: 3000 },
    { directReferrals: 50, teamRecruitment: 10000, reward: 6000 },
    { directReferrals: 60, teamRecruitment: 30000, reward: 12000 },
    { directReferrals: 70, teamRecruitment: 60000, reward: 20000 },
    { directReferrals: 80, teamRecruitment: 100000, reward: 30000 },
    { directReferrals: 90, teamRecruitment: 300000, reward: 50000 },
    { directReferrals: 100, teamRecruitment: 600000, reward: 110000 },
    { directReferrals: 110, teamRecruitment: 1000000, reward: 200000 }
  ];

  useEffect(() => {
    // Fetch user's current investments and wallet balance
    const fetchUserData = async () => {
      try {
        // Fetch investments
        const investmentsResponse = await axios.get('/get-user-investments');
        if (investmentsResponse.data && investmentsResponse.data.result) {
          setUserInvestments(investmentsResponse.data.result);
        }

        // Fetch user profile to get wallet balances
        const profileResponse = await axios.get('/user/profile');
        if (profileResponse.data && profileResponse.data.result) {
          const userData = profileResponse.data.result;
          console.log('User wallet balance:', userData.wallet);
          console.log('User topup wallet balance:', userData.wallet_topup);
          setUserWallet(userData.wallet);
          setUserTopupWallet(userData.wallet_topup || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [loading]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAmount('');
    setError('');
  };

  const handleOpenReleaseDialog = (investment) => {
    // Check if investment has a positive current value
    const currentValue = investment.current_value !== undefined ?
      parseFloat(investment.current_value) : parseFloat(investment.amount);

    if (currentValue <= 0) {
      openSnackbar({
        open: true,
        message: 'This investment has no funds available to release',
        variant: 'alert',
        alert: {
          color: 'warning'
        }
      });
      return;
    }

    setSelectedInvestment(investment);
    setReleaseAmount('');
    setError('');
    setOpenReleaseDialog(true);
  };

  const handleCloseReleaseDialog = () => {
    setOpenReleaseDialog(false);
    setSelectedInvestment(null);
    setReleaseAmount('');
    setError('');
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleReleaseAmountChange = (e) => {
    setReleaseAmount(e.target.value);
    setError('');
  };

  const handleInvest = async () => {
    // Validate amount
    const investAmount = parseFloat(amount);
    if (isNaN(investAmount) || investAmount < minInvestment || investAmount > maxInvestment) {
      setError(`Investment amount must be between $${minInvestment} and $${maxInvestment}`);
      return;
    }

    // Check if user has enough funds in top-up wallet
    if (investAmount > userTopupWallet) {
      setError(`Insufficient funds. Your top-up wallet balance is $${userTopupWallet.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      // Make API call to create trading package investment
      const response = await axios.post('/add-trading-package', {
        amount: investAmount
      });

      if (response.data && response.data.status) {
        openSnackbar({
          open: true,
          message: 'Investment successful!',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });

        // Update local state
        if (response.data.data) {
          setUserInvestments([...userInvestments, response.data.data.investment]);

          // Update top-up wallet balance
          const newTopupWalletBalance = userTopupWallet - investAmount;
          setUserTopupWallet(newTopupWalletBalance);

          // If there was a first deposit bonus, add it to the main wallet balance
          if (response.data.data.firstDepositBonus) {
            setUserWallet(userWallet + response.data.data.firstDepositBonus);
          }
        }

        handleCloseDialog();
      } else {
        setError(response.data.message || 'Investment failed. Please try again.');
      }
    } catch (error) {
      console.error('Investment error:', error);
      setError('Investment failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  console.log(userInvestments)
  const handleRelease = async () => {
    // Validate amount
    if (!selectedInvestment) {
      setError('No investment selected');
      return;
    }
   
    const releaseValue = parseFloat(releaseAmount);
    if (isNaN(releaseValue) || releaseValue <= 0) {
      setError('Release amount must be a positive number');
      return;
    }

    const currentValue = selectedInvestment.current_value || selectedInvestment.amount;
    if (releaseValue > currentValue) {
      setError(`Cannot release more than the current value of $${currentValue.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      // Make API call to release funds from investment

      const response = await axios.post('/release-investment', {
        investment_id: selectedInvestment.id,
        amount: releaseValue
      });

      if (response.data.status) {
        openSnackbar({
          open: true,
          message: 'Funds released successfully!',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });

        // Update local state
        const updatedInvestments = userInvestments.map(inv => {
          if (inv._id === selectedInvestment._id) {
            return {
              ...inv,
              current_value: response.data.new_current_value
            };
          }
          return inv;
        });

        setUserInvestments(updatedInvestments);

        // Update wallet balance
        setUserWallet(userWallet + releaseValue);

        // Show a special message if the investment is now fully released
        if (response.data.new_current_value <= 0) {
          openSnackbar({
            open: true,
            message: 'Investment fully released! All funds have been transferred to your wallet.',
            variant: 'alert',
            alert: {
              color: 'info'
            }
          });
        }

        handleCloseReleaseDialog();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Release error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Trading Package Overview */}
      <Grid item xs={12}>
        <MainCard title="Trading Package">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Investment Range
              </Typography>
              <Typography variant="body1" paragraph>
                Minimum Investment: ${minInvestment}
              </Typography>
              <Typography variant="body1" paragraph>
                Maximum Investment: ${maxInvestment}
              </Typography>
              <Typography variant="body1" paragraph>
                Daily Trading Profit: 2.5%
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Your Main Wallet Balance: ${userWallet.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                Your Top-up Wallet Balance: ${userTopupWallet.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Note: Investments are made from your Top-up Wallet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mt: 2 }}
              >
                Invest Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Your Investments
              </Typography>
              {userInvestments.length > 0 ? (
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Amount</TableCell>
                        <TableCell>Current Value</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userInvestments.map((investment, index) => (
                        <TableRow key={index}>
                          <TableCell>${investment.amount}</TableCell>
                          <TableCell>
                            ${investment.current_value !== undefined && parseFloat(investment.current_value) <= 0
                              ? '0.00'
                              : (investment.current_value ? parseFloat(investment.current_value).toFixed(2) : parseFloat(investment.amount).toFixed(2))}
                          </TableCell>
                          <TableCell>{new Date(investment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{investment.status}</TableCell>
                          <TableCell>
                            {(investment.status === 'active' || investment.status === 1) &&
                             (investment.current_value ? parseFloat(investment.current_value) > 0 : parseFloat(investment.amount) > 0) && (
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => handleOpenReleaseDialog(investment)}
                                disabled={investment.current_value < 1}
                              >
                                {investment.current_value < 1 ? "Released" : "Release"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">No investments yet.</Typography>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      {/* Investment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Invest in Trading Package</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount you want to invest. The amount must be between ${minInvestment} and ${maxInvestment}.
            <br />
            <strong>Your top-up wallet balance: ${userTopupWallet.toFixed(2)}</strong>
            <br />
            <Typography variant="caption" color="textSecondary">
              Note: Investments are made from your Top-up Wallet. If you need to add funds, please visit the Deposit Funds page.
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Investment Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleInvest}
            variant="contained"
            color="primary"
            disabled={loading || !amount}
          >
            {loading ? 'Processing...' : 'Invest'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Release Dialog */}
      <Dialog open={openReleaseDialog} onClose={handleCloseReleaseDialog}>
        <DialogTitle>Release Investment Funds</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount you want to release from this investment to your main wallet.
            <br />
            {selectedInvestment && (
              <>
                <strong>Investment amount: ${selectedInvestment.amount.toFixed(2)}</strong>
                <br />
                <strong>Current value: ${(selectedInvestment.current_value || selectedInvestment.amount).toFixed(2)}</strong>
                <br />
              </>
            )}
            <Typography variant="caption" color="textSecondary">
              Note: Released funds will be added to your main wallet and can be withdrawn.
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="releaseAmount"
            label="Release Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={releaseAmount}
            onChange={handleReleaseAmountChange}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReleaseDialog}>Cancel</Button>
          <Button
            onClick={handleRelease}
            variant="contained"
            color="secondary"
            disabled={loading || !releaseAmount}
          >
            {loading ? 'Processing...' : 'Release Funds'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TradingPackage;
