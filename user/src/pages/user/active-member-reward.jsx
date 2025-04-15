import { useMemo } from 'react';
import CommonDatatable from 'helpers/CommonDatatable';

// material-ui
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| ACTIVE MEMBER REWARD PAGE ||============================== //

export default function ActiveMemberReward() {
  const apiPoint = 'get-all-incomes';

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

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id'
      },
      {
        header: 'Direct Referrals',
        accessorKey: 'extra.directReferrals'
      },
      {
        header: 'Team Size',
        accessorKey: 'extra.teamSize'
      },
      {
        header: 'Reward Amount',
        accessorKey: 'amount'
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => {
          return new Date(props.getValue()).toLocaleString();
        },
        enableColumnFilter: false,
        enableGrouping: false
      }
    ],
    []
  );

  return (
    <Grid container spacing={3}>
   

  
      <Grid item xs={12}>
        
          <CommonDatatable columns={columns} apiPoint={apiPoint} type="active_member_reward" />
        
      </Grid>
    </Grid>
  );
}
