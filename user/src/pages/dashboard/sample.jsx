import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, useTheme, alpha } from '@mui/material';
import { 
  Chart, 
  Wallet, 
  People, 
  MoneyRecive, 
  Medal, 
  TrendUp, 
  DollarCircle,
  NotificationBing,
  Calendar,
  Clock,
  Activity
} from 'iconsax-react';

// Animated components
import { AnimatedSection, AnimatedText } from 'components/animated';
import StatCard from 'components/cards/StatCard';
import ProfileCard from 'components/cards/ProfileCard';
import TradingPackageCard from 'components/cards/TradingPackageCard';
import ProgressCard from 'components/cards/ProgressCard';
import AnimatedChart from 'components/charts/AnimatedChart';
import AnimatedBanner from 'components/banners/AnimatedBanner';
import AnimatedTimeline from 'components/timeline/AnimatedTimeline';
import AnimatedTable from 'components/tables/AnimatedTable';
import AnimatedNotification from 'components/notifications/AnimatedNotification';
import PageTransition from 'components/transitions/PageTransition';

// Sample data
const sampleUserData = {
  username: 'johndoe',
  id: '123456789',
  total_investment: 5000,
  wallet: 2500,
  extra: {
    directReferrals: 12,
    dailyProfit: 125,
    firstDepositBonus: 200,
    referralBonus: 350,
    teamCommission: 480,
    activeMemberReward: 150,
    totalEarnings: 1305
  }
};

// Sample chart data
const profitChartData = [
  {
    name: 'Daily Profit',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
  }
];

const profitChartOptions = {
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  },
  title: {
    text: 'Daily Profit Growth',
    align: 'left'
  }
};

// Sample table data
const transactionsColumns = [
  { field: 'id', headerName: 'ID', sortable: true },
  { field: 'date', headerName: 'Date', type: 'date', sortable: true },
  { field: 'type', headerName: 'Type', sortable: true },
  { field: 'amount', headerName: 'Amount', type: 'currency', align: 'right', sortable: true },
  { field: 'status', headerName: 'Status', type: 'status', align: 'center', sortable: true }
];

const transactionsData = [
  { id: 1, date: '2023-10-01', type: 'Investment', amount: 1000, status: 'completed' },
  { id: 2, date: '2023-10-02', type: 'Profit', amount: 25, status: 'completed' },
  { id: 3, date: '2023-10-03', type: 'Referral Bonus', amount: 50, status: 'completed' },
  { id: 4, date: '2023-10-04', type: 'Withdrawal', amount: 100, status: 'pending' },
  { id: 5, date: '2023-10-05', type: 'Team Commission', amount: 75, status: 'completed' }
];

// Sample timeline data
const timelineItems = [
  {
    title: 'Investment Made',
    description: 'You invested $1,000 in Trading Package',
    date: '2023-10-01',
    icon: <Chart size={20} />,
    color: 'primary'
  },
  {
    title: 'Daily Profit',
    description: 'You earned $25 from daily trading profit',
    date: '2023-10-02',
    icon: <TrendUp size={20} />,
    color: 'success'
  },
  {
    title: 'Referral Bonus',
    description: 'You received $50 from referral bonus',
    date: '2023-10-03',
    icon: <People size={20} />,
    color: 'warning'
  },
  {
    title: 'Withdrawal Requested',
    description: 'You requested a withdrawal of $100',
    date: '2023-10-04',
    icon: <Wallet size={20} />,
    color: 'info'
  }
];

const SampleDashboard = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUserData(sampleUserData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition variant="fadeUp" transition="smooth">
      <Box sx={{ mb: 4 }}>
        <AnimatedText 
          variant="h3" 
          animation="fadeInUp" 
          gradient="primary"
          sx={{ mb: 1, fontWeight: 700 }}
        >
          Welcome to HebrewServe
        </AnimatedText>
        <AnimatedText 
          variant="body1" 
          animation="fadeInUp" 
          delay={0.1}
          color="text.secondary"
        >
          Your dashboard for trading packages and referral earnings
        </AnimatedText>
      </Box>

      {showNotification && (
        <Box sx={{ mb: 4 }}>
          <AnimatedNotification
            title="New Feature Available!"
            message="Check out our new trading packages with higher daily profits."
            icon={<NotificationBing size={24} />}
            variant="subtle"
            color="info"
            delay={0.2}
            onClose={() => setShowNotification(false)}
            action={{
              label: "View Packages",
              onClick: () => console.log("View packages clicked")
            }}
          />
        </Box>
      )}

      <AnimatedSection animation="fadeInUp" delay={0.3}>
        <ProfileCard
          username={userData?.username}
          userId={userData?.id}
          referralLink={`${window.location.origin}/login?ref=${userData?.username}`}
          stats={[
            { label: 'Total Investment', value: userData?.total_investment || 0, prefix: '$', color: 'primary' },
            { label: 'Direct Referrals', value: userData?.extra?.directReferrals || 0, color: 'warning' },
            { label: 'Total Earnings', value: userData?.extra?.totalEarnings || 0, prefix: '$', color: 'success' }
          ]}
          delay={0.4}
        />
      </AnimatedSection>

      <Box sx={{ mt: 4 }}>
        <AnimatedText 
          variant="h5" 
          animation="fadeInUp" 
          delay={0.5}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Dashboard Overview
        </AnimatedText>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Daily Trading Profit"
              value={userData?.extra?.dailyProfit || 0}
              prefix="$"
              decimals={2}
              icon={<TrendUp size={24} />}
              color="primary"
              variant="gradient"
              delay={0.6}
              description="2.5% daily profit from investments"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Wallet Balance"
              value={userData?.wallet || 0}
              prefix="$"
              decimals={2}
              icon={<Wallet size={24} />}
              color="success"
              variant="default"
              delay={0.7}
              description="Your current wallet balance"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Referral Bonus"
              value={userData?.extra?.referralBonus || 0}
              prefix="$"
              decimals={2}
              icon={<People size={24} />}
              color="warning"
              variant="outlined"
              delay={0.8}
              description="Earnings from direct referrals"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <AnimatedText 
          variant="h5" 
          animation="fadeInUp" 
          delay={0.9}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Performance Metrics
        </AnimatedText>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AnimatedChart
              title="Profit History"
              subtitle="Your daily profit over time"
              type="area"
              series={profitChartData}
              options={profitChartOptions}
              height={350}
              delay={1.0}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ProgressCard
              title="Investment Goal"
              subtitle="Progress towards your $10,000 goal"
              value={userData?.total_investment || 0}
              maxValue={10000}
              progressType="circular"
              variant="default"
              color="primary"
              delay={1.1}
              size={120}
              thickness={5}
              footer={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Started: Oct 1, 2023
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="bold">
                    ${(10000 - (userData?.total_investment || 0)).toFixed(2)} to go
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <AnimatedText 
          variant="h5" 
          animation="fadeInUp" 
          delay={1.2}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Recent Transactions
        </AnimatedText>

        <AnimatedTable
          title="Transaction History"
          columns={transactionsColumns}
          data={transactionsData}
          pagination={true}
          sortable={true}
          initialSortBy="date"
          initialSortDirection="desc"
          delay={1.3}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <AnimatedText 
          variant="h5" 
          animation="fadeInUp" 
          delay={1.4}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Activity Timeline
        </AnimatedText>

        <AnimatedTimeline
          items={timelineItems}
          delay={1.5}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <AnimatedText 
          variant="h5" 
          animation="fadeInUp" 
          delay={1.6}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Investment Opportunities
        </AnimatedText>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TradingPackageCard
              title="Starter Package"
              minInvestment={50}
              maxInvestment={500}
              dailyProfit={2.5}
              bgColor={`linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`}
              color="primary"
              delay={1.7}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TradingPackageCard
              title="Advanced Package"
              minInvestment={500}
              maxInvestment={2000}
              dailyProfit={2.5}
              bgColor={`linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`}
              color="warning"
              delay={1.8}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TradingPackageCard
              title="Premium Package"
              minInvestment={2000}
              maxInvestment={10000}
              dailyProfit={2.5}
              bgColor={`linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`}
              color="success"
              delay={1.9}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <AnimatedBanner
          title="Refer Friends & Earn More"
          description="Earn up to $700 for each referral plus team commissions up to 3 levels deep."
          icon={<People size={40} variant="Bold" />}
          variant="gradient"
          color="secondary"
          pattern="/dashboard-pattern.png"
          delay={2.0}
          primaryAction={{
            label: "Share Referral Link",
            onClick: () => console.log("Share referral link clicked")
          }}
          secondaryAction={{
            label: "Learn More",
            onClick: () => console.log("Learn more clicked")
          }}
        />
      </Box>
    </PageTransition>
  );
};

export default SampleDashboard;
