import CommonDatatable from 'helpers/CommonDatatable'
import ExportCSV from 'myComponents/ExportCSV';
import { useMemo } from 'react';
import { Typography, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

export default function TeamCommission() {
  const apiPoint = 'get-all-incomes'

  // Team commission rates
  const commissionRates = [
    { level: '1st Level', rate: '16%', requirement: 'One Direct compulsory' },
    { level: '2nd Level', rate: '8%', requirement: 'One Direct compulsory' },
    { level: '3rd Level', rate: '4%', requirement: 'One Direct compulsory' }
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
          return 'Team Commission';
        }
      },
      {
        header: 'From User',
        accessorKey: 'user_id_from',
        cell: (props) => {
          const value = props.getValue();
          return value || 'N/A';
        }
      },
      {
        header: 'Level',
        accessorKey: 'level',
        cell: (props) => {
          const level = props.getValue() || 1;
          return `Level ${level}`;
        }
      },
      {
        header: 'Daily Profit',
        accessorKey: 'extra.dailyProfit',
        cell: (props) => {
          const value = props?.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Commission Rate',
        accessorKey: 'extra.commissionRate',
        cell: (props) => {
          const level = props.row.original?.level || 1;
          let rate = '16%';
          if (level === 2) rate = '8%';
          if (level === 3) rate = '4%';
          return rate;
        }
      },
      {
        header: 'Commission Amount',
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
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"team_commission"} />
    </>
  )
}