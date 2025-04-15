import React from 'react';
import { Grid, Box, Typography, useTheme, alpha, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import { TickCircle, InfoCircle, DocumentText } from 'iconsax-react';

const Terms = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please read these terms carefully before using our platform
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="HebrewServe Platform Terms">
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="white" gutterBottom>
                General Terms
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to HebrewServe. By accessing or using our platform, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of the terms, you may not access the platform.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="white" gutterBottom>
                Financial Terms
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TickCircle size={20} color={theme.palette.primary.main} variant="Bold" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="white">
                        Minimum and maximum withdrawal is 20% of trade amount
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        You can only withdraw up to 20% of your total investment at a time
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider sx={{ my: 1, opacity: 0.1 }} />
                <ListItem>
                  <ListItemIcon>
                    <TickCircle size={20} color={theme.palette.primary.main} variant="Bold" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="white">
                        Admin and service charge is 5%
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        All withdrawals are subject to a 5% service fee
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider sx={{ my: 1, opacity: 0.1 }} />
                <ListItem>
                  <ListItemIcon>
                    <TickCircle size={20} color={theme.palette.primary.main} variant="Bold" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="white">
                        Person to person fund transfer charge is 2%
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        When transferring funds to another user, a 2% fee will be applied
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="white" gutterBottom>
                Rank System
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                HebrewServe offers a rank system with different benefits based on your investment and team size:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6), mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rank Benefits
                </Typography>
                <Typography variant="body1" color="white">
                  • ACTIVE: 2.5% trade booster, 0 level ROI income, 1 daily limit view
                </Typography>
                <Typography variant="body1" color="white">
                  • PRIME: 3% trade booster, 1 level ROI income, 2 daily limit view
                </Typography>
                <Typography variant="body1" color="white">
                  • VETERAM: 3.5% trade booster, 2 level ROI income, 3 daily limit view
                </Typography>
                <Typography variant="body1" color="white">
                  • ROYAL: 4% trade booster, 3 level ROI income, 4 daily limit view
                </Typography>
                <Typography variant="body1" color="white">
                  • SUPREME: 4.5% trade booster, 5 level ROI income, 5 daily limit view
                </Typography>
              </Paper>
              <Typography variant="body1" color="text.secondary">
                Your rank is determined by your minimum trade balance and active team size. Higher ranks provide better benefits.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="white" gutterBottom>
                Team Rewards
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                HebrewServe offers team rewards based on your team's deposit amount and maintenance period:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6), mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Team Reward Tiers
                </Typography>
                <Typography variant="body1" color="white">
                  • $100,000 team deposit for 30 days: $15,000 reward
                </Typography>
                <Typography variant="body1" color="white">
                  • $300,000 team deposit for 60 days: $50,000 reward
                </Typography>
                <Typography variant="body1" color="white">
                  • $1,200,000 team deposit for 90 days: $500,000 reward
                </Typography>
              </Paper>
              <Typography variant="body1" color="text.secondary">
                Team rewards are credited to your wallet after the maintenance period is completed.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" color="white" gutterBottom>
                Privacy and Confidentiality
              </Typography>
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.6), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <InfoCircle size={20} style={{ marginRight: 12, marginTop: 4, color: theme.palette.primary.main }} variant="Bold" />
                  <Typography variant="body1" color="white">
                    The Company will maintain the confidentiality of all Client information in accordance with applicable laws.
                  </Typography>
                </Box>
              </Paper>
              <Typography variant="body1" color="text.secondary">
                We take your privacy seriously and implement appropriate measures to protect your personal information.
              </Typography>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Terms;
