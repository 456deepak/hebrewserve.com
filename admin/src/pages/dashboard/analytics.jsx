// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { alpha, Avatar, Box, Button, Card, CardContent, Divider, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import NewOrders from 'sections/widget/chart/NewOrders';
import NewUsers from 'sections/widget/chart/NewUsers';
import Visitors from 'sections/widget/chart/Visitors';

import DropboxStorage from 'sections/widget/statistics/DropboxStorage';
import SwitchBalanace from 'sections/widget/statistics/SwitchBalanace';

import ProjectAnalytics from 'sections/widget/chart/ProjectAnalytics';

import EcommerceIncome from 'sections/widget/chart/EcommerceIncome';
import LanguagesSupport from 'sections/widget/chart/LanguagesSupport';

import ProductOverview from 'sections/widget/chart/ProductOverview';

import PaymentHistory from 'sections/widget/data/PaymentHistory';
import EcommerceRadial from 'sections/widget/chart/EcommerceRadial';

// assets
import { User, People, DollarCircle, Chart, MoneyRecive, MoneySend, Wallet3 } from 'iconsax-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import ReactApexChart from 'react-apexcharts';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [user, setUserData] = useState({});
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, new: 0 },
    investments: { total: 0, today: 0 },
    income: { total: 0, direct: 0, team: 0, daily: 0 },
    transactions: { deposits: 0, withdrawals: 0, transfers: 0 }
  });
  const [topUsers, setTopUsers] = useState([]);
  const [topInvestments, setTopInvestments] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main dashboard data
        const response = await axios.get("/get-all-users-data");
        if (response.status === 200) {
          setUserData(response.data?.result);

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
        }

        // Fetch top users (mock data for now)
        setTopUsers([
          { id: 1, username: 'user1@example.com', name: 'John Doe', investment: 5000, referrals: 12 },
          { id: 2, username: 'user2@example.com', name: 'Jane Smith', investment: 3500, referrals: 8 },
          { id: 3, username: 'user3@example.com', name: 'Robert Johnson', investment: 2800, referrals: 5 },
          { id: 4, username: 'user4@example.com', name: 'Emily Davis', investment: 2000, referrals: 3 },
          { id: 5, username: 'user5@example.com', name: 'Michael Wilson', investment: 1500, referrals: 2 },
        ]);

        // Fetch top investments (mock data for now)
        setTopInvestments([
          { id: 1, username: 'user1@example.com', package: 'Premium', amount: 5000, date: '2023-04-10' },
          { id: 2, username: 'user2@example.com', package: 'Standard', amount: 2500, date: '2023-04-09' },
          { id: 3, username: 'user3@example.com', package: 'Premium', amount: 4000, date: '2023-04-08' },
          { id: 4, username: 'user4@example.com', package: 'Basic', amount: 1000, date: '2023-04-07' },
          { id: 5, username: 'user5@example.com', package: 'Standard', amount: 2000, date: '2023-04-06' },
        ]);

        // Fetch recent transactions (mock data for now)
        setRecentTransactions([
          { id: 1, username: 'user1@example.com', type: 'Deposit', amount: 1000, date: '2023-04-10' },
          { id: 2, username: 'user2@example.com', type: 'Withdrawal', amount: 500, date: '2023-04-09' },
          { id: 3, username: 'user3@example.com', type: 'Transfer', amount: 300, date: '2023-04-08' },
          { id: 4, username: 'user4@example.com', type: 'Deposit', amount: 2000, date: '2023-04-07' },
          { id: 5, username: 'user5@example.com', type: 'Withdrawal', amount: 1500, date: '2023-04-06' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Chart options for user activity
  const userActivityOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: { strokeDashArray: 0 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: theme.palette.text.secondary } }
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    tooltip: { theme: 'light' },
    legend: { position: 'top' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]
  };

  // Chart series for user activity (sample data)
  const userActivitySeries = [
    { name: 'Logins', data: [30, 40, 35, 50, 49, 60, 70] },
    { name: 'Registrations', data: [5, 6, 8, 7, 9, 10, 8] },
    { name: 'Investments', data: [10, 15, 12, 20, 18, 25, 22] }
  ];

  // Chart options for income breakdown
  const incomeBreakdownOptions = {
    chart: {
      type: 'pie',
      height: 350
    },
    labels: ['Daily Profit', 'Direct Referral', 'Team Commission', 'Active Member'],
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
    tooltip: { theme: 'light' }
  };

  // Chart series for income breakdown
  const incomeBreakdownSeries = [
    stats.income.daily,
    stats.income.direct,
    stats.income.team,
    stats.income.daily * 0.2
  ];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* row 1 - Key Metrics */}
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Users"
          count={stats.users.total.toString()}
          percentage={10.2}
          extra={`New: ${stats.users.new}`}
          color="primary"
          icon={<User variant="Bold" />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Investments"
          count={`$${stats.investments.total.toFixed(2)}`}
          percentage={8.4}
          extra={`Today: $${stats.investments.today.toFixed(2)}`}
          color="success"
          icon={<DollarCircle variant="Bold" />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AnalyticEcommerce
          title="Total Income Generated"
          count={`$${stats.income.total.toFixed(2)}`}
          percentage={12.8}
          extra={`Direct: $${stats.income.direct.toFixed(2)}`}
          color="warning"
          icon={<Chart variant="Bold" />}
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
          icon={<Wallet3 variant="Bold" />}
        />
      </Grid>

      {/* row 2 - Charts */}
      <Grid item xs={12} md={8}>
        <MainCard title="User Activity" secondary={<Button component={Link} to="/user/allUsers" size="small">View All</Button>}>
          <ReactApexChart options={userActivityOptions} series={userActivitySeries} type="line" height={350} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <MainCard title="Income Breakdown" secondary={<Button component={Link} to="/incomes/direct" size="small">View All</Button>}>
          <ReactApexChart options={incomeBreakdownOptions} series={incomeBreakdownSeries} type="pie" height={350} />
        </MainCard>
      </Grid>

      {/* row 3 - Tables */}
      <Grid item xs={12} md={6}>
        <MainCard title="Top Users" secondary={<Button component={Link} to="/user/allUsers" size="small">View All</Button>}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Investment</TableCell>
                  <TableCell align="right">Referrals</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell align="right">${user.investment}</TableCell>
                    <TableCell align="right">{user.referrals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Top Investments" secondary={<Button component={Link} to="/investments/invest-report" size="small">View All</Button>}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>{investment.username}</TableCell>
                    <TableCell>{investment.package}</TableCell>
                    <TableCell align="right">${investment.amount}</TableCell>
                    <TableCell>{investment.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* row 4 - Recent Transactions */}
      <Grid item xs={12}>
        <MainCard title="Recent Transactions" secondary={<Button component={Link} to="/transaction-reports/transfer-fund-reports" size="small">View All</Button>}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell align="right">${transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          bgcolor:
                            transaction.type === 'Deposit' ? alpha(theme.palette.success.main, 0.2) :
                            transaction.type === 'Withdrawal' ? alpha(theme.palette.error.main, 0.2) :
                            alpha(theme.palette.warning.main, 0.2),
                          color:
                            transaction.type === 'Deposit' ? theme.palette.success.main :
                            transaction.type === 'Withdrawal' ? theme.palette.error.main :
                            theme.palette.warning.main,
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {transaction.type === 'Deposit' ? 'Completed' :
                         transaction.type === 'Withdrawal' ? 'Processed' :
                         'Completed'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
}
