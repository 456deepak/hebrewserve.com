import { useMemo } from 'react';
import CommonDatatable from 'helpers/CommonDatatable';

// material-ui
import { Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| TEAM COMMISSION PAGE ||============================== //

export default function TeamCommission() {
  const apiPoint = 'get-all-incomes';

  // Team commission data
  const teamCommissionData = [
    { level: '1st Level', bonus: '16%', requirement: 'One Direct compulsory' },
    { level: '2nd Level', bonus: '8%', requirement: 'One Direct compulsory' },
    { level: '3rd Level', bonus: '4%', requirement: 'One Direct compulsory' }
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
        header: 'Level',
        accessorKey: 'level'
      },
      {
        header: 'Commission Amount',
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
    
      {/* Team Commission History */}
      <Grid item xs={12}>
      
          <CommonDatatable columns={columns} apiPoint={apiPoint} type="team_commission" />
    
      </Grid>
    </Grid>
  );
}
