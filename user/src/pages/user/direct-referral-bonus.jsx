import { useMemo } from 'react';
import CommonDatatable from 'helpers/CommonDatatable';

// material-ui
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| DIRECT REFERRAL BONUS PAGE ||============================== //

export default function DirectReferralBonus() {
  const apiPoint = 'get-all-incomes';

  // Direct referral bonus table data
  const directReferralBonusData = [
    { amount: 100, bonus: 5 },
    { amount: 500, bonus: 50 },
    { amount: 1000, bonus: 90 },
    { amount: 3000, bonus: 250 },
    { amount: 5000, bonus: 500 },
    { amount: 10000, bonus: 700 }
  ];

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id'
      },
      {
        header: 'From',
        accessorKey: 'user_id_from'
      },
      {
        header: 'Referral Amount',
        accessorKey: 'extra.referralAmount'
      },
      {
        header: 'Bonus Amount',
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

      {/* Referral Bonus History */}
      <Grid item xs={12}>
        
          <CommonDatatable columns={columns} apiPoint={apiPoint} type="referral_bonus" />
        
      </Grid>
    </Grid>
  );
}
