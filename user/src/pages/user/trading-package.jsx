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

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
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
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userInvestments.map((investment, index) => (
                        <TableRow key={index}>
                          <TableCell>${investment.amount}</TableCell>
                          <TableCell>{new Date(investment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{investment.status}</TableCell>
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
    </Grid>
  );
};

export default TradingPackage;
