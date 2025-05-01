// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, Avatar, Box, Button, Card, CardContent, Divider, Paper } from '@mui/material';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import ProjectOverview from 'sections/widget/chart/ProjectOverview';
import ProjectRelease from 'sections/dashboard/default/ProjectRelease';
import AssignUsers from 'sections/widget/statistics/AssignUsers';

import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';

// assets
import { AddCircle, ArrowDown, ArrowUp, Book, Calendar, CloudChange, Home3, Wallet3, User, People, DollarCircle, Chart, MoneyRecive, MoneySend } from 'iconsax-react';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import { Fab } from '@mui/material';
import axios from 'utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import LoadingButton from 'components/@extended/LoadingButton';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import ReactApexChart from 'react-apexcharts';


// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const navigate = useNavigate()

  const [loading, setLoading] = useState({})

  const reset = async (resetType) => {
    setLoading(old => { return { ...old, [`${resetType}`]: true } })
    try {
      const response = await axios.get(`/${resetType}`)
      if (response.status === 200)
        if (resetType.includes("reset-setup-db"))
          window.location.href = '/login'
        else
          openSnackbar({
            open: true,
            message: "Plans are reset successfully!",
            variant: 'alert',

            alert: {
              color: 'success'
            }
          })
      else
        openSnackbar({
          open: true,
          message: response.data?.message,
          variant: 'alert',

          alert: {
            color: 'success'
          }
        })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(old => { return { ...old, [`${resetType}`]: false } })
    }
  }


  let crons = [
    // { title: "Assign Tokens", url: "assignTokens" },
    { title: "Reset Assign Tokens", url: "resetAssignTokens" },
    { title: "Withdraw", url: "withdrawCron" }
  ]

  const runCron = async (cronType) => {
    // First set loading state
    setLoading(old => { return { ...old, [`${cronType}`]: true } });

    try {
      // Use a more modern approach than prompt() which can freeze the UI
      // We'll use SweetAlert2 which is already imported in the axios interceptors
      const { value: password } = await import('sweetalert2').then((Swal) => {
        return Swal.default.fire({
          title: 'Enter Cron Password',
          input: 'password',
          inputPlaceholder: 'Enter your password',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value || value.trim() === '') {
              return 'Please enter a valid password';
            }
          }
        });
      });

      // If user cancels the dialog or doesn't enter a password
      if (!password) {
        return;
      }

      // Get the correct base URL from environment variables
      const baseURL = import.meta.env.VITE_APP_TEST === '1'
        ? import.meta.env.VITE_APP_TEST_API_URL
        : import.meta.env.VITE_APP_PROD_API_URL;

      // Make the API request with a timeout
      const response = await axios.post(`${baseURL}/cron/${cronType}`, { key: password }, {
        timeout: 30000 // 30 seconds timeout for cron jobs which might take longer
      });

      // Show success message
      openSnackbar({
        open: true,
        message: response.data?.message || 'Cron job executed successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });

      // Refresh dashboard data after cron job
      fetchDashboardData();

    } catch (error) {
      console.error('Cron job error:', error);

      // Show error message
      openSnackbar({
        open: true,
        message: error?.response?.data?.message || error?.message || 'Failed to execute cron job',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      // Always reset loading state
      setLoading(old => { return { ...old, [`${cronType}`]: false } });
    }
  }

  const [user, setUserData] = useState({})
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, new: 0 },
    investments: { total: 0, today: 0 },
    income: { total: 0, direct: 0, team: 0, daily: 0 },
    transactions: { deposits: 0, withdrawals: 0, transfers: 0 }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/get-all-users-data");
      if (response.status === 200) {
        setUserData(response.data?.result || {});

        // Set stats based on the response
        setStats({
          users: {
            total: response.data?.result?.userCount || 0,
            active: Math.floor((response.data?.result?.userCount || 0) * 0.8),
            new: Math.floor((response.data?.result?.userCount || 0) * 0.1)
          },
          investments: {
            total: response.data?.result?.totalInvestment || 0,
            today: response.data?.result?.totalCount || 0
          },
          income: {
            total: (response.data?.result?.directIncome || 0) + (response.data?.result?.levelIncome || 0) + (response.data?.result?.provisionIncome || 0) + (response.data?.result?.matrixIncome || 0),
            direct: response.data?.result?.directIncome || 0,
            team: response.data?.result?.levelIncome || 0,
            daily: response.data?.result?.provisionIncome || 0
          },
          transactions: {
            deposits: response.data?.result?.totalInvestment || 0,
            withdrawals: response.data?.result?.withdrawals || 0,
            transfers: 0
          }
        });
      } else {
        setError('Failed to fetch dashboard data');
        console.error('API Error:', response?.data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set a flag to track if the component is mounted
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchDashboardData();
      }
    };

    loadData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [])

  const generateRandomPercentage = (inputValue) => {
    const maxPercentage = inputValue ? parseInt(inputValue) : 0;
    const percentage = Math.random() * maxPercentage;
    return percentage.toFixed(2)
  }

  // Chart options for user growth
  const userChartOptions = {
    chart: {
      type: 'area',
      height: 200,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: { strokeDashArray: 0 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: theme.palette.text.secondary } }
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    tooltip: { theme: 'light' },
    colors: [theme.palette.primary.main]
  };

  // Chart series for user growth (sample data)
  const userChartSeries = [{
    name: 'Users',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 150, 200, stats.users.total]
  }];

  // Chart options for investment distribution
  const investmentChartOptions = {
    chart: {
      type: 'donut',
      height: 200
    },
    labels: ['$50-$100', '$101-$500', '$501-$1000', '$1001-$5000', '$5001+'],
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, theme.palette.info.main],
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' }
  };

  // Chart series for investment distribution (sample data)
  const investmentChartSeries = [15, 25, 30, 20, 10];

  // Chart options for income sources
  const incomeChartOptions = {
    chart: {
      type: 'bar',
      height: 200,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: ['Daily Profit', 'Direct Referral', 'Team Commission', 'Active Member'],
      labels: { style: { colors: theme.palette.text.secondary } }
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    fill: { opacity: 1 },
    tooltip: { theme: 'light' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]
  };

  // Chart series for income sources (sample data)
  const incomeChartSeries = [{
    name: 'Income',
    data: [stats.income.daily, stats.income.direct, stats.income.team, stats.income.daily * 0.2]
  }];

  // Show loading state
  if (isLoading) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Loading Dashboard Data...</Typography>
          {/* You can add a spinner or progress indicator here */}
        </Box>
      </MainCard>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
          <Typography variant="h4" color="error" sx={{ mb: 2 }}>Error Loading Dashboard</Typography>
          <Typography>{error}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={fetchDashboardData}>Retry</Button>
        </Box>
      </MainCard>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - Welcome and Quick Actions */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircle />}
                component={Link}
                to="/user/allUsers"
              >
                View All Users
              </Button>
              {/* <LoadingButton
                loading={loading['withdrawCron']}
                variant="contained"
                color="secondary"
                startIcon={<Calendar />}
                onClick={() => runCron('withdrawCron')}
              >
                Run Daily Cron
              </LoadingButton> */}
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      {/* row 2 - Key Metrics */}
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Users"
          count={stats.users.total.toString()}
          percentage={10.2}
          // extra="Active: " + stats.users.active
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Investments"
          count={`$${stats.investments.total.toFixed(2)}`}
          percentage={8.4}
          // extra={`Today: ${stats.investments.today.toFixed(2) || 0}`}
          color="success"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Income Generated"
          count={`$${stats.income.total.toFixed(2)}`}
          percentage={12.8}
          extra={`Direct: $${stats.income.direct.toFixed(2)}`}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Transactions"
          count={`$${(stats.transactions.deposits + stats.transactions.withdrawals).toFixed(2)}`}
          percentage={-2.1}
          isLoss
          extra={`Withdrawals: $${stats.transactions.withdrawals.toFixed(2)}`}
          color="error"
        />
      </Grid>

      {/* row 3 - Charts */}
      <Grid item xs={12} md={4}>
        <MainCard title="User Growth" secondary={<Button component={Link} to="/user/allUsers" size="small">View All</Button>}>
          <ReactApexChart options={userChartOptions} series={userChartSeries} type="area" height={350} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <MainCard title="Investment Distribution" secondary={<Button component={Link} to="/investments/invest-report" size="small">View All</Button>}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pt: 2 }}>
            <ReactApexChart options={investmentChartOptions} series={investmentChartSeries} type="donut" height={350} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <MainCard title="Income Sources" secondary={<Button component={Link} to="/incomes/direct" size="small">View All</Button>}>
          <ReactApexChart options={incomeChartOptions} series={incomeChartSeries} type="bar" height={350} />
        </MainCard>
      </Grid>

      {/* row 4 - Quick Access */}
      <Grid item xs={12}>
        <MainCard title="Quick Access">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, p: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 60, height: 60 }}>
                    <People size={32} />
                  </Avatar>
                  <Typography variant="h6">User Management</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    component={Link}
                    to="/user/allUsers"
                  >
                    View Users
                  </Button>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, p: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.success.main, width: 60, height: 60 }}>
                    <DollarCircle size={32} />
                  </Avatar>
                  <Typography variant="h6">Investments</Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    component={Link}
                    to="/investments/invest-report"
                  >
                    View Investments
                  </Button>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2, p: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 60, height: 60 }}>
                    <MoneyRecive size={32} />
                  </Avatar>
                  <Typography variant="h6">Income Reports</Typography>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    component={Link}
                    to="/incomes/direct"
                  >
                    View Income
                  </Button>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, p: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.error.main, width: 60, height: 60 }}>
                    <MoneySend size={32} />
                  </Avatar>
                  <Typography variant="h6">Transactions</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    component={Link}
                    to="/transaction-reports/transfer-fund-reports"
                  >
                    View Transactions
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* Original metrics */}
      <Grid item xs={12}>
        <MainCard title="Business Metrics">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Total Team"
                count={(user?.userCount ?? 0)}
                iconPrimary={<Wallet3 />}
                percentage={
                  <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.userCount)}%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.primary.main} />
              </EcommerceDataCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Total Investment"
                count={user?.totalInvestment}
                iconPrimary={<Wallet3 />}
                percentage={
                  <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.totalInvestment)}%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.primary.main} />
              </EcommerceDataCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Direct Bonus"
                count={user?.directIncome}
                color="warning"
                iconPrimary={<Book color={theme.palette.warning.dark} />}
                percentage={
                  <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> {generateRandomPercentage(user?.directIncome)}%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.warning.dark} />
              </EcommerceDataCard>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Withdrawals"
                count={user?.withdrawals}
                color="error"
                iconPrimary={<CloudChange color={theme.palette.error.dark} />}
                percentage={
                  <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.withdrawals)}%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.error.dark} />
              </EcommerceDataCard>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}
