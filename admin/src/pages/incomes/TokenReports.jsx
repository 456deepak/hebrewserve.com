import CommonDatatable from 'helpers/CommonDatatable'
import ExportCSV from 'myComponents/ExportCSV';
import { useMemo } from 'react';
import { Typography, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

export default function FirstDepositBonus() {
  const apiPoint = 'get-all-incomes'

  // First deposit bonus tiers
  const bonusTiers = [
    { investment: 100, bonus: 7 },
    { investment: 500, bonus: 15 },
    { investment: 1000, bonus: 50 },
    { investment: 3000, bonus: 100 },
    { investment: 5000, bonus: 200 },
    { investment: 10000, bonus: 500 }
  ];

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id',
        cell: (props) => {
          const value = props.getValue();
          return value || 'N/A';
        }
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (props) => {
          return 'First Deposit Bonus';
        }
      },
      {
        header: 'Investment Amount',
        accessorKey: 'extra.investmentAmount',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Bonus Amount',
        accessorKey: 'amount',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const value = props.getValue() || 'pending';
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => {
          const value = props.getValue();
          return value ? new Date(value).toLocaleString() : 'N/A';
        },
        enableColumnFilter: true,
        enableGrouping: true
      }
    ],
    []
  );

  return (
    <>
      
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"first_deposit_bonus"} />
    </>
  )
}