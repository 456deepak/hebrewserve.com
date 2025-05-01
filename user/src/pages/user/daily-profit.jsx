import { useMemo } from 'react';
import CommonDatatable from 'helpers/CommonDatatable';

// material-ui
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| DAILY TRADING PROFIT PAGE ||============================== //

export default function DailyProfit() {
  const apiPoint = 'get-all-incomes';

  const columns = useMemo(
    () => [
      // Removed User ID column as we're only showing the current user's data
      {
        header: 'Investment ID',
        accessorKey: 'investment_id'
      },
      {
        header: 'Investment Amount',
        accessorKey: 'extra.investmentAmount'
      },
      {
        header: 'Compounded Amount',
        accessorKey: 'extra.currentInvestmentValue'
      },
      {
        header: 'Profit Amount',
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
      

      {/* Daily Trading Profit History */}
      <Grid item xs={12}>
        
          <CommonDatatable columns={columns} apiPoint={apiPoint} type="daily_profit" />
        
      </Grid>
    </Grid>
  );
}
