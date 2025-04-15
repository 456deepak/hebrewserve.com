import { useMemo } from 'react';
import CommonDatatable from 'helpers/CommonDatatable';

// material-ui
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| FIRST DEPOSIT BONUS PAGE ||============================== //

export default function FirstDepositBonus() {
  const apiPoint = 'get-all-incomes';

  // First deposit bonus table data
  const firstDepositBonusData = [
    { amount: 100, bonus: 7 },
    { amount: 500, bonus: 15 },
    { amount: 1000, bonus: 50 },
    { amount: 3000, bonus: 100 },
    { amount: 5000, bonus: 200 },
    { amount: 10000, bonus: 500 }
  ];

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id'
      },
      {
        header: 'Investment Amount',
        accessorKey: 'extra.investmentAmount'
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
    
      {/* First Deposit Bonus History */}
      <Grid item xs={12}>
      
          <CommonDatatable columns={columns} apiPoint={apiPoint} type="first_deposit_bonus" />
       
      </Grid>
    </Grid>
  );
}
